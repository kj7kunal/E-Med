const express = require("express"),
    router = express.Router(),
    db = require('../models'),
    isAuthenticated = require("../config/middleware/isAuthenticated"),
    passport = require("../config/passport");


// --------------------- Login / Signup --------------------------

// Route for Patient Login
router.get("/", (req, res) => {
    if (req.user) {
        return res.redirect("/patients");
    } else {
        return res.render("index");
    }
});

router.post("/api/login", passport.authenticate("user-local"), (req, res) => {
    return res.send("/patients");
});

// Route for Patient Login

router.get("/admin", (req, res) => {
    if (req.user) {
        return res.redirect("/patients");
    } else {
        return res.render("admin");
    }
});

router.post("/api/admin-login", passport.authenticate("admin-local"), (req, res) => {
    return res.send("/physician")
});

// Route for logging user out
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

// -------------  Patient ---------------------------
router.get("/patients", isAuthenticated, (req, res) => {

    if (req.user) {
        db.patient.findOne({
            where: {
                id: req.user.patientId
            }
        }).then((result) => {
            const hbsObject = { patient: result }
            console.log(hbsObject);
            return res.render("patientDash", hbsObject);
        })
    } else {
        return res.render("index");
    }
});

router.get("/chat", isAuthenticated, (req, res) => { res.render("chatbox") });


//  ---------------- STAFF ROUTES ----------------------

router.get("/physician", isAuthenticated, (req, res) => { res.render("physician") });

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

router.get("/record", isAuthenticated, (req, res) => { res.render("healthRecord") });

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

router.get("/calendar", (req, res) => { res.render("calendar") });
router.get("/patient", (req, res) => { res.render("patientDash") });
router.get("/mycare", (req, res) => { res.render("myCare") });
router.get("/chatview", (req, res) => { res.render("chatview") });


module.exports = router;