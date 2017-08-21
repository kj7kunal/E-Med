const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");

router.get("/", (req, res) => {
    if (req.user) {
        return res.redirect("/patients");
    }
    return res.render("index");
});

// -------------  Patient ---------------------------
router.get("/patients", isAuthenticated, (req, res) => {
    if (req.user) {
        return res.render("patientDash");
    }
    return res.render("index");
});

router.get("/chat", isAuthenticated, (req, res) => { res.render("chatbox") });






//  ---------------- STAFF ROUTES ----------------------

router.get("/physician", isAuthenticated, function(req, res) {
    res.render("physician");
});

router.get("/physician/list", isAuthenticated, (req, res) => {
    db.patient.findAll().then((result) => {
        // console.log(result);
        const hbsObject = { patient: result };
        // router.get("/api/user_data", (req, res) => {
        //     const userId = res.id;
        // })
        return res.render("patients_list", hbsObject);
    })
})

router.get("/record", function(req, res) {
    res.render("healthRecord");
});

router.get("/patients/:id", isAuthenticated, (req, res) => {
    db.patient.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        const hbsObject = { patient: result }
        return res.render("patients_page", hbsObject)
    })
})

router.get("/patients/:id/:view", isAuthenticated, (req, res) => {
    db.patient
        .findOne({
            where: {
                id: req.params.id
            }
        })
        .then(result => {
            const hbsObject = { patient: result };
            return res.render("viewPatient", hbsObject);
        });
});

router.get("/patients/add", isAuthenticated, (req, res) => { res.render("patients_new") });

router.post("/patients/add", (req, res) => {
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
        .then(() => {
            return res.redirect("/patients");
        })
})

// --------------------- Login / Signup --------------------------

router.post("/api/login", passport.authenticate("local"), (req, res) => {
    // console.log("THIS TYPE: " + req.user.type);

    // res.json({ id: req.user.id }) // specifically for json

    if (req.user.type === "staff") {
        // res.json({ id: req.user.id })
        return res.send("/physician");

    } else {
        // res.json({ id: req.user.id })
        return res.send("/patients");

    }
    // for when you need to respond with non json values 

});

router.post("/api/signup", (req, res) => {
    console.log(req.body);
    db.User.create({
        email: req.body.email,
        password: req.body.password
    }).then(() => {
        res.redirect(307, "/api/login");
    }).catch((err) => {
        console.log(err);
        res.json(err);

    });
});



// Route for logging user out
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// Route for getting some data about our user to be used client side
router.get("/api/user_data", (req, res) => {
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