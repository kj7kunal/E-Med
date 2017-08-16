console.log("hello");
const keys = require("../config/keys");


// Initialize Firebase
var config = {
    apiKey: apiKey,
    authDomain: authDomain,
    databaseURL: databaseURL,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId
};
firebase.initializeApp(config);