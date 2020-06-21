const functions = require('firebase-functions');
const admin = require('firebase-admin');

const app = admin.initializeApp();



exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello World !");
});


exports.getScreams = functions.https.onRequest((req,res) =>{
    admin.firestore().collection('screams').get()
        .then(data => {
            let screams = []
            data.forEach(doc => {
                screams.push(doc.data())
            });
            return res.json(screams);
        })
        .catch(err=>console.error(err));
});


exports.createScreams = functions.https.onRequest((req,res) =>{
    if(req.method !== "POST") {
        res.status(400).json({error : "method are not allowed !"});
    }
    const newScream = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
        })
})