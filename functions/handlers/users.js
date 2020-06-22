const { db, firebase } = require("../util/admin");

const {validataSignupData,validateLoginData} = require("../util/validators");

signupRoute = (req,res) =>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    //Validate User
    var resultErrors = validataSignupData(newUser);
    
    if(!resultErrors.valid) return res.status(400).json(resultErrors.errors);
    
    
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
                userId
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


loginRoute = (req,res)=>{
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

module.exports = {loginRoute,signupRoute};