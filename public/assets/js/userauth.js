// Initialize Firebase
const keys = {
    apiKey: "AIzaSyAhLuisc8G_Eyouo5PrUJueukcxGa39SmQ",
    authDomain: "patient-stack.firebaseapp.com",
    databaseURL: "https://patient-stack.firebaseio.com",
    projectId: "patient-stack",
    storageBucket: "",
    messagingSenderId: "321078645548"
};

firebase.initializeApp(keys);

let userEmail, password = "";

function userSignUp(event) {

    // prevent page reload
    event.preventDefault;
    // store input data
    userEmail = $("#user-email").val();
    password = $("#user-password").val().trim();


    console.log("User: " + userEmail + " Password: " + password);

    // email must be > 4
    if (userEmail.length < 4) {
        alert("Please enter an email address.");
        return;
    }
    // password must be > 4
    if (password.length < 4) {
        alert("Please enter a password.");
        return;
    }
    // IF email & password are valid, create user
    firebase.auth().createUserWithEmailAndPassword(userEmail, password).catch(function(error) {
        // Handle Errors
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        if (errorCode == 'auth/week-password') {
            alert("The password is too weak.");
        } else {
            alert(errorMessage);
        }
        console.log(error);
    }); // end createUserWithEmailAndPassword

    // reset form
    $("#user-email").val("");
    $("#user-password").val("");

}; // end userSignUp

// user Login in Navbar
function userLogin(event) {

    // prevent page reload
    event.preventDefault;
    userEmail = $("#user-name").val();
    password = $("#current-password").val();
    if (firebase.auth().currentUser) {
        // start signout
        firebase.auth().signOut();
        // end signout
    } else {
        if (userEmail.length < 4) {
            alert("Please enter an email address.");
            return;
        }
        if (password.length < 4) {
            alert("Please enter a password.");
            return;
        }
    }
    // sign in with email & pasword
    firebase.auth().signInWithEmailAndPassword(userEmail, password).catch(function(error) {
        console.log("User: " + userEmail + " Password: " + password);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // disable / hide login ***
        console.log("successful login!");
    });
    // reset form
    $("#user-name").val("");
    $("#current-password").val("");

}; // end userLogin

// handles event listeners & registering Firebase auth listeners
function initApp() {
    // listens for changes to auth (login / sign ou)
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // if user is signed in
            var email = user.email;
            console.log("Signed In!");
            $("#login-2").hide();
            $("#sign-up-2").hide();
            $("#create-form").hide();
            $("#login").hide();
            $("#sign-up").hide();
            $("#signout-btn").show();

        } else {
            // if user is signed out
            console.log("User is Signed out!");
            $("#signout-btn").hide();
            $("#login").show();
            $("#sign-up").show();
            // CREATE SIGNED IN BUTTON ***
        }
    });
    //  EVENT LISTENERS

    // submit button on Sign-Up
    $("#btn-add").on("click", function(event) {
        event.preventDefault;
        console.log('user added?');
        userSignUp(event);
    });

    // enter key on Sign-up
    $("#sign-up-2").on("keypress", function(event) {
        event.preventDefault;
        if (event.which == 13) {
            console.log("Enter!")
            userSignUp(event);
        }
    });

    // submit button on Login
    $("#btn-login").on("click", function(event) {
        event.preventDefault;
        console.log("Entered on Form!");
        userLogin(event);
    });

    // enter key on login
    $("#login-2").on("keypress", function(event) {
        event.preventDefault;
        if (event.which == 13) {
            console.log("Enter on form!");
            userLogin(event);
        }
    });

    // signout event handler to sign user out
    $("#signout-btn").on("click", function(event) {
        event.preventDefault;
        firebase.auth().signOut().then(function() {
            console.log("User is signed out!");
            $("#login").show();
            $("#sign-up").show();
            $("#signout-btn").hide();
        }, function(error) {
            console.error("sign out error: " + error);
        })
    })
}


window.onload = function() {
    initApp();
};