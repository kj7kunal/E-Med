const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");

router.get("/", (req, res) => {
    if (req.user) {
        res.redirect("/patients");
    }
    res.render("signup");
});

router.get("/login", (req, res) => {
    if (req.user) {
        console.log("Logged in YAY!");
        res.redirect("/patients");
    }

    res.render("login");
});

router.get("/chat", isAuthenticated, (req, res) => { res.render("chatbox") });

router.get("/patients/add", isAuthenticated, (req, res) => { res.render("patients_new") });

router.get("/patients", isAuthenticated, (req, res) => {
    db.patient.findAll().then((result) => {
        // console.log(result);
        const hbsObject = { patient: result };
        res.render("patients_list", hbsObject);
    })
})

router.get("/patients/:id", isAuthenticated, (req, res) => {
    db.patient.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        const hbsObject = { patient: result }
        res.render("patients_page", hbsObject)
    })
})

router.post("/patients/add", isAuthenticated, (req, res) => {
    db.patient.create({
            "first_name": req.body.firstName,
            "last_name": req.body.lastName,
            "dob": req.body.dob,
            "street_address": req.body.streetAddress,
            "city": req.body.city,
            "state": req.body.state,
            "zip": req.body.zip,
            "telephone": req.body.telephone,
            "height": req.body.height,
            "weight": req.body.weight,
            "allergies": req.body.allergies,
            "procedures": req.body.procedures,
            "emergency_contact_name": req.body.emergencyContactName,
            "emergency_contact_number": req.body.emergencyContactNumber,
            "provider_name": req.body.providerName,
            "appointments": req.body.appointments,
            "image": req.body.image
        })
        .then(function() {
            res.redirect("/patients");
        })
})


// --------------------- Login / Signup --------------------------

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/patients");
});

// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
        email: req.body.email,
        password: req.body.password
    }).then(function() {
        res.redirect(307, "/api/login");
    }).catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
    });
});

// Route for logging user out
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

// Route for getting some data about our user to be used client side
router.get("/api/user_data", function(req, res) {
    if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
    } else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    }
});
module.exports = router;