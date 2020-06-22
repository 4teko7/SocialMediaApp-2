const { db, firebase,admin } = require("../util/admin");

const {validataSignupData,validateLoginData,reduceUserDetails} = require("../util/validators");

const { firebaseConfig } = require('../util/config');

const signupMethod = (req,res) =>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    //Validate User
    var resultErrors = validataSignupData(newUser);
    
    if(!resultErrors.valid) return res.status(400).json(resultErrors.errors);
    // noimageuser
    var noImageUser = "noImageUser.png"
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImageUser}?alt=media`;
    
    // If User is not exist , save it. or give an error
    let token,userId;
    db.doc(`/users/${newUser.handle}`).get() // db.collection(`users`).doc()
        .then(doc =>{
            if(doc.exists){
                return res.status(400).json({handle: 'this handle is already taken !'});
            }else{
               return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email,newUser.password)
            }
        })
        .then(data =>{
            userId = data.user.uid;
            return data.user.getIdToken();
        })
        .then(tokenReturned =>{
            token = tokenReturned;
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId,
                imageUrl
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
            
        })
        .then(data => {
            res.status(201).json({token});
        })
        .catch(err =>{
            console.error(err);
            if(err.code === "auth/email-already-in-use"){
                return res.status(400).json({email:'Email is already in use'});
            }else{
                res.status(500).json({error: err.code});
            }
            
        })

}


const loginMethod = (req,res)=>{
    const user = {
        email : req.body.email,
        password : req.body.password
    }

    var resultErrors = validateLoginData(user);

    if(!resultErrors.valid)  return res.status(400).json(resultErrors.errors);

    firebase.auth().signInWithEmailAndPassword(user.email,user.password)
        .then(data => {
            return data.user.getIdToken();
        })
        .then(token =>{
            res.json(token);
        })
        .catch(err=>{
            console.error(err);
            if(err.code === "auth/wrong-password"){
                res.status(403).json("Email or Password is wrong !");
            }else if(err.code === "auth/user-not-found"){
                res.status(403).json("User Not Found !")
            }else{
                res.status(500).json({error:err.code});
            }
            
        })



}

//Add User Profile Image
const uploadImageMethod = (req,res)=>{
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busBoy = new BusBoy({headers : req.headers});

    let imageFileName;
    let imageToBeUploaded = {};

    busBoy.on('file',(fieldname,file,filename,encoding,mimetype)=>{
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png'){
            return res.status(400).json({message: "jpeg and png are allowed !!!"});
        }
        console.log(fieldname);
        console.log(filename);
        console.log(mimetype);

        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${Math.round(Math.random()*10000000000000)}.${imageExtension}`;
        const filePath = path.join(os.tmpdir(),imageFileName);
        imageToBeUploaded = {filePath,mimetype};
        file.pipe(fs.createWriteStream(filePath));
    
    });

    busBoy.on('finish',() =>{
        admin.storage().bucket().upload(imageToBeUploaded.filePath,{
            resumable:false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        }).then(()=>{
            const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
            return db.doc(`/users/${req.user.handle}`).update({imageUrl});
        })
        .then(()=>{
            return res.json({message: "Image Uplaoded Successfully !"});
        })
        .catch(err =>{
            console.error(err.code);
            return res.status(500).json({error:err.code});
        })
    });

    busBoy.end(req.rawBody);

}


//Add User Details
const addUserDetails = (req,res) =>{
    console.error("asdasd");
    let userDetails = reduceUserDetails(req.body);
    console.error(userDetails);
    db.doc(`/users/${req.user.handle}`).update(userDetails)
        .then(() =>{
            return res.status(201).json({message: "Details updated successfully..."});
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({message:"Something went wrong !"});
        });
}



const getAuthenticatedUser = (req,res) =>{
    let userData = {};

    db.doc(`/users/${req.user.handle}`).get()
        .then(doc =>{
            if(doc.exists){
                userData.credentials = doc.data();
                return db.collection('likes').where('userHandle','==','req.user.handle').get();
            }
        })
        .then(data =>{
            userData.likes = [];
            data.forEach(doc =>{
                userData.likes.push(doc.data())
            });
            return res.json(userData);
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error: err.code});
        })
}

module.exports = {loginMethod,signupMethod,uploadImageMethod,addUserDetails,getAuthenticatedUser};