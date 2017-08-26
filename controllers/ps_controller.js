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

// Route for Admin Login
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

// -------------  Patient ---------------------------
router.get("/patients", isAuthenticated, (req, res) => {
    if (req.user) {
        db.patient.findOne({
            where: {
                id: req.user.patientId
            }
        }).then((result) => {
            const hbsObject = {
                    patient: result
                }
                // console.log(hbsObject);
            return res.render("patientDash", hbsObject);
        })
    } else {
        return res.render("index");
    }
});

router.get("/mycare", isAuthenticated, (req, res) => {
    db.patient
        .findOne({
            where: {
                id: req.user.patientId
            }
        })
        .then(result => {
            const hbsObject = {
                patient: result
            };
            return res.render("myCare", hbsObject);
        });
});

router.get("/record", isAuthenticated, (req, res) => {
    db.patient
        .findOne({
            where: {
                id: req.user.patientId
            }
        })
        .then(result => {
            const hbsObject = {
                patient: result
            };
            return res.render("healthRecord", hbsObject);
        });
});

router.get("/labresults", isAuthenticated, (req, res) => {
    db.patient
        .findOne({
            where: {
                id: req.user.patientId
            }
        })
        .then(result => {
            const hbsObject = {
                patient: result
            };
            return res.render("labResults", hbsObject);
        });
});

router.get("/patientsettings", isAuthenticated, (req, res) => {
    res.render("patientset");
});

router.get("/chat", isAuthenticated, (req, res) => {
    res.render("patientchat");
});

router.get("/patientcalendar", isAuthenticated, (req, res) => {
  res.render("patientcal");
});


//  ---------------- STAFF ROUTES ----------------------
router.get("/physician/list", isAuthenticated, (req, res) => {
    db.patient.findAll().then((result) => {
        // console.log(result);
        const hbsObject = {
            patient: result
        };
        // router.get("/api/user_data", (req, res) => {
        //     const userId = res.id;
        // })
        return res.render("patients_list", hbsObject);
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
            const hbsObject = {
                patient: result
            };
            return res.render("viewPatient", hbsObject);
        });
});

// lab results <-----------------------
router.get("/patients/:id/lab_results", isAuthenticated, (req, res) => {
    res.render("lab_results")
});

router.get("/patients/add", isAuthenticated, (req, res) => {
    res.render("patients_new")
});

router.post("/patients/add", isAuthenticated, (req, res) => {
    console.log("testing2");
    db.patient.create({
            "first_name": req.body.firstName,
            "last_name": req.body.lastName,
            "dob": req.body.dob,
            "gender": req.body.gender,
            "street_address": req.body.streetAddress,
            "city": req.body.city,
            "gender": "F",
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
            return res.redirect("/physician/list");
        })
})

// --------------------- Login / Signup --------------------------

router.post("/api/login", passport.authenticate("user-local"), (req, res) => {
    return res.send("/patients");
});

router.post("/api/signup", (req, res) => {
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

router.get("/physician/:id", isAuthenticated, (req, res) => {
    // res.render("physician");
    db.doctors.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: db.alerts
        }]
    }).then((result) => {
        const hbsObject = {
            doctor: result
        }
        res.render("doctor", hbsObject);
    })
});

router.get("/physician", isAuthenticated, (req, res) => {
    if (req.user) {
        db.doctors.findOne({
            where: {
                id: req.user.id
            },
            include: [{
                model: db.alerts
            }]
        }).then((result) => {
            const hbsObject = {
                doctor: result
            }
            return res.render("doctor", hbsObject);
        })
    } else {
        return res.render("admin");
    }
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
    } else if (req.user.type === "admin") {
        // staff / admin login
        db.doctors.findOne({
            where: {
                id: req.user.id
            }
        }).then((result) => {
            const user = {
                name: "Dr. " + result.last_name,
                img: result.image
            }
            return user;
        }).then(user => {
            return res.json({
                email: req.user.email,
                id: req.user.id,
                username: user.name,
                avatar: user.img
            });
        })
    } else {
        // patient login
        db.patient.findOne({
            where: {
                id: req.user.id
            }
        }).then((result) => {
            const user = {
                name: result.first_name,
                img: result.image
            }
            return user;
        }).then(user => {
            return res.json({
                email: req.user.email,
                id: req.user.id,
                username: user.name,
                avatar: user.img
            });
        })
    }
});

router.get("/chatview", isAuthenticated, (req, res) => {
    db.message.findAll().then((result) => {
        const hbsObject = {
            message: result
        };

        return res.render("chatview", hbsObject);
    })
})

router.get("/calendar", isAuthenticated, (req, res) => {
    res.render("calendar")
});
router.get("/patientdashboard", isAuthenticated, (req, res) => {
    res.render("patientDash")
});
router.get("/settings", isAuthenticated, (req, res) => res.render("settings"));

router.get("/specialists", isAuthenticated, (req, res) => {
    db.specialists.findAll().then((result) => {
        const hbsObject = {
            specialists: result
        };
        res.render("specialists", hbsObject);
    })
});

router.get("/specialists/add", isAuthenticated, (req, res) => {
    db.specialists.findAll().then((result) => {
        const hbsObject = {
            specialists: result
        };
        res.render("specialists_new", hbsObject);
    })
});

router.post("/specialists/add", isAuthenticated, (req, res) => {
    db.specialists.create({
            "first_name": req.body.firstName,
            "last_name": req.body.lastName,
            "street_address": req.body.streetAddress,
            "city": req.body.city,
            "state": req.body.state,
            "zip": req.body.zip,
            "telephone": req.body.telephone,
            "image": req.body.image
        })
        .then(function() {
            res.redirect("/specialists");
        })
})

router.delete("/specialists/delete/:id", isAuthenticated, (req, res) => {
    var theid = req.param.id;
    console.log(theid);

    db.specialists.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(result) {
        res.json({
            success: true,
            url: '/specialists'
        })
    });

});

// ROUTES FOR TASK ADD AND DELETE //
router.delete("/tasks/delete/:id", isAuthenticated, (req, res) => {
    var theid = req.param.id;
    console.log(theid);

    db.alerts.destroy({
        where: {
            id: req.params.id
        }
    }).then(function(result) {
        res.json({
            success: true,
            url: '/physician'
        })
    });

});

router.post("/tasks/add", isAuthenticated, (req, res) => {
    db.alerts.create({
            "type": req.body.type,
            "message": req.body.message,
            "is_alert": req.body.isAlert,
            "doctorId": req.user.id
        })
        .then(() => {
            return res.redirect("/physician");
        })
})

router.get("/assoc", isAuthenticated, (req, res) => {
    db.doctors.findAll({
        where: {
            id: 1
        },
        include: [{
            model: db.alerts
        }]
    }).then(function(match) {
        res.json(match);
    });
});

router.get("/patients/:id", isAuthenticated, (req, res) => {
    db.patient.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        const hbsObject = {
            patient: result
        }
        return res.render("patients_page", hbsObject)
    })
})

module.exports = router;