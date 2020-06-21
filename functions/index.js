const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyCSwMwTdTiN8P1FmjjSYCtHvciX6tu232U",
    authDomain: "react-firebase-socialmediaapp.firebaseapp.com",
    databaseURL: "https://react-firebase-socialmediaapp.firebaseio.com",
    projectId: "react-firebase-socialmediaapp",
    storageBucket: "react-firebase-socialmediaapp.appspot.com",
    messagingSenderId: "175656998934",
    appId: "1:175656998934:web:a50d1f9539791924073d37",
    measurementId: "G-N0C96FNNX9"
  };

const firebase = require('firebase');
const e = require('express');
firebase.initializeApp(firebaseConfig);


const db = admin.firestore();



// https://baseurl.com/api/screams  = get
app.get('/screams',(req,res)=>{

    db.collection('screams')
    .orderBy('createdAt','desc')
    .get()
    .then(data => {
        let screams = []
        data.forEach(doc => {
            screams.push({
                screamId: doc.id,
                ...doc.data()
            })
        });
        return res.json(screams);
    })
    .catch(err=>console.error(err));

});

// https://baseurl.com/api/screams  = post
app.post('/screams',(req,res) =>{
   
    if(req.method !== "POST") {
        res.status(400).json({error : "method are not allowed !"});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: new Date().toISOString()
    }
    db.collection('screams')
    .add(newScream)
    .then(doc =>{
        return res.json({message: `document ${doc.id} was creatsed successfully`}) //return is not necessary. res automatically sends...
    })
    .catch(err =>{
        res.status(500).json({error:"something went wrong..."})
        console.error(err);
    });

});


// Signup route
app.post('/signup',(req,res) =>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle
    }

    //Validate User

    // db.collection(`users`).doc()
    let token,userId;
    db.doc(`/users/${newUser.handle}`).get()
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

});















// https://baseurl.com/api/

exports.api = functions.region('europe-west1').https.onRequest(app);  // If you want the machine region be europe-west1

// exports.api = functions.https.onRequest(app); 