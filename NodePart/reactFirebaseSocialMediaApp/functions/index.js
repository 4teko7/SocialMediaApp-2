const functions = require('firebase-functions');
const { getAllScreams,postOneScream,getScream, commentOnScream,likeScream,unlikeScream,deleteScream } = require("./handlers/screams");
const { signupMethod,loginMethod,uploadImageMethod, addUserDetails,getAuthenticatedUser,getUserDetails,markNotificationsRead} = require("./handlers/users");
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

app.get('/user/:handle',getUserDetails);

app.post('/notifications', checkAuth ,markNotificationsRead)








// https://baseurl.com/api/

exports.api = functions.region('europe-west1').https.onRequest(app);  // If you want the machine region be europe-west1


exports.createNotificationOnLike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onCreate(snapshot =>{
        console.error("HERE IT IS @")
       return db.doc(`/screams/${snapshot.data().screamId}`).get()
            .then(doc =>{
                if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
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
            .catch(err =>{
                console.error(err);
                return res.status(500).json({error: err.code});
            })
    })



exports.deleteNotificationOnUnLike = functions.region('europe-west1').firestore.document('likes/{id}')
    .onDelete((snapshot,context) =>{
       return db.doc(`/notifications/${snapshot.id}`)
            .delete()
            .catch(err =>{
                console.error(err);
                return res.status(500).json({error:err.code});
            })
    })


exports.createNotificationOnComment = functions.region('europe-west1').firestore.document('comments/{id}')
.onCreate(snapshot =>{
    return db.doc(`/screams/${snapshot.data().screamId}`).get()
        .then(doc =>{
            if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
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
        .catch(err =>{
            console.error(err);
            return res.status(500).json({error: err.code});
        })
})



exports.onUserImageChange = functions.region('europe-west1').firestore.document('users/{userId}')
    .onUpdate(change =>{
        console.log(change.before.data());
        console.log(change.after.data());
        if(change.before.data().imageUrl !== change.after.data().imageUrl){
            
            
            const batch = db.batch();
            return db.collection('screams').where('userHandle','==',change.before.data().handle).get()
            
            .then(data =>{
                data.forEach(doc=>{
                    const scream = db.doc(`/screams/${doc.id}`);
                    batch.update(scream,{userImage: change.after.data().imageUrl});
                });
                return db.collection('comments').where('userHandle','==',change.after.data().imageUrl);
            })
            .then(data =>{
                data.forEach(doc =>{
                    const comment = db.doc(`/comments/${doc.id}`);
                    batch.update(comment,{userImage: change.after.data().imageUrl});
                })
                return batch.commit();
            })
            .catch(err=>{
                console.error(err);
            })

    }else{
        return true;
    }

    });


exports.onScreamDelete = functions.region('europe-west1').firestore.document('screams/{screamId}')
    .onDelete((snapshot,context) =>{
        const screamId = context.params.screamId;
        const batch = db.batch();
        return db.collection('comments').where('screamId','==',screamId).get()
            .then(data =>{
                data.forEach(doc =>{
                    batch.delete(db.doc(`/comments/${doc.id}`));
                })
                return db.collection('likes').where('screamId','==',screamId).get();
            })
            .then(data =>{
                data.forEach(doc =>{
                    batch.delete(db.doc(`/likes/${doc.id}`));
                })
                return db.collection('notifications').where('screamId','==',screamId).get();
            })
            .then(data => {
                data.forEach(doc =>{
                    batch.delete(db.doc(`/notifications/${doc.id}`));
                })
                return batch.commit();
            })
            .catch(err =>{
                console.error(err);
                
            })
    })

// exports.api = functions.https.onRequest(app); 