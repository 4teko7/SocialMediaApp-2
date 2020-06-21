const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

// https://baseurl.com/api/screams  = get
app.get('/screams',(req,res)=>{

    admin.firestore().collection('screams')
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
    admin.firestore()
        .collection('screams')
        .add(newScream)
        .then(doc =>{
            return res.json({message: `document ${doc.id} was creatsed successfully`}) //return is not necessary. res automatically sends...
        })
        .catch(err =>{
            res.status(500).json({error:"something went wrong..."})
            console.error(err);
        });

});


// https://baseurl.com/api/

exports.api = functions.region('europe-west1').https.onRequest(app);  // If you want the machine region be europe-west1

// exports.api = functions.https.onRequest(app); 