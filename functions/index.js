const functions = require('firebase-functions');
const { getAllScreams,postOneScream,getScream, commentOnScream,likeScream,unlikeScream,deleteScream } = require("./handlers/screams");
const { signupMethod,loginMethod,uploadImageMethod, addUserDetails,getAuthenticatedUser} = require("./handlers/users");
const {firebaseConfig} = require("./util/config");
const { checkAuth } = require("./util/checkAuth");
const { firebase, db } = require("./util/admin");

const express = require('express');

const app = express();
firebase.initializeApp(firebaseConfig);

let errors = {};

//Scream Routes

app.get('/screams',getAllScreams);

app.get('/screams/:screamId',getScream);

app.get('/screams/:screamId/like',checkAuth,likeScream);

app.get('/screams/:screamId/unlike',checkAuth,unlikeScream);

app.post('/screams', checkAuth, postOneScream);

app.post('/screams/:screamId/comment', checkAuth, commentOnScream);

app.delete("/screams/:screamId",checkAuth,deleteScream);

// TODO: delete scream
// TODO: like a scream
// TODO: unlike a scream
// TODO: comment on a scream





//User Routes
app.post('/signup',signupMethod);

app.post('/login',loginMethod);

app.post('/user/image', checkAuth ,uploadImageMethod);

app.post('/user',checkAuth,addUserDetails);

app.get("/user",checkAuth,getAuthenticatedUser)









// https://baseurl.com/api/

exports.api = functions.region('europe-west1').https.onRequest(app);  // If you want the machine region be europe-west1


exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onCreate(snapshot =>{
        console.error("HERE IT IS @")
        db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc =>{
                if(doc.exists){
                    return db.doc(`/notifications/${snapshot.id}`).set({
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        read: false,
                        screamId: doc.id,
                        type: "like",
                        createdAt: new Date().toISOString()
                    })
                }
            })
            .then(() =>{
                return;
            })
            .catch(err =>{
                console.error(err);
                return res.status(500).json({error: err.code});
            })
    })



exports.deleteNotificationOnUnLike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onDelete((snapshot,context) =>{
        const likeDocument = db.doc(`/notifications/${snapshot.id}`)
        likeDocument.get()
            .then(doc =>{
            return doc.delete()
            })
            .then(() =>{
                return;
            })
            .catch(err =>{
                console.error(err);
                return res.status(500).json({error:err.code});
            })
    })


exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
.onCreate(snapshot =>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
        .then(doc =>{
            if(doc.exists){
                return db.doc(`/notifications/${snapshot.id}`).set({
                    recipient: doc.data().userHandle,
                    sender: snapshot.data().userHandle,
                    read: false,
                    screamId: doc.id,
                    type: "comment",
                    createdAt: new Date().toISOString()
                })
            }
        })
        .then(() =>{
            return;
        })
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error: err.code});
        })
})

// exports.api = functions.https.onRequest(app); 