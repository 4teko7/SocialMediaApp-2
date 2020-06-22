const functions = require('firebase-functions');
const { getAllScreams,postOneScream,getScream, commentOnScream,likeScream,unlikeScream,deleteScream } = require("./handlers/screams");
const { signupMethod,loginMethod,uploadImageMethod, addUserDetails,getAuthenticatedUser} = require("./handlers/users");
const {firebaseConfig} = require("./util/config");
const { checkAuth } = require("./util/checkAuth");
const { firebase } = require("./util/admin");

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

// exports.api = functions.https.onRequest(app); 