const functions = require('firebase-functions');
const { getAllScreams,postOneScream } = require("../handlers/screams");
const { signupRoute,loginRoute } = require("../handlers/users");
const {firebaseConfig} = require("../util/config");
const { checkAuth } = require("../util/checkAuth");
const { firebase } = require("../util/admin");

const express = require('express');

const app = express();
firebase.initializeApp(firebaseConfig);

let errors = {};

//Scream Routes

app.get('/screams',getAllScreams);

app.post('/screams', checkAuth, postOneScream);



//User Routes
app.post('/signup',signupRoute);

app.post('/login',loginRoute);












// https://baseurl.com/api/

exports.api = functions.region('europe-west1').https.onRequest(app);  // If you want the machine region be europe-west1

// exports.api = functions.https.onRequest(app); 