const express = require("express"),
    router = express.Router(),
    db = require('../models');

router.get("/", (req, res) => { res.render("index") });

router.get("/chat", (req, res) => { res.render("chatbox") });

router.get("/patients/add", (req, res) => { res.render("patients_new") });

router.get("/patients", (req, res) => {
    db.patient.findAll().then((result) => {
        console.log(result);
        const hbsObject = { patient: result };
        res.render("patients_list", hbsObject);
    })
})

router.get("/patients/:id", (req, res) => {
    db.patient.findOne({
        where: {
            id: req.params.id
        }
    }).then((result) => {
        const hbsObject = { patient: result }
        res.render("patients_page", hbsObject)
    })
})

router.get("/patients/:id/:view", (req, res) => {
  db.patient
    .findOne({
      where: {
        id: req.params.id
      }
    })
    .then(result => {
      const hbsObject = { patient: result };
      res.render("viewPatient", hbsObject);
    });
});

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
        .then(function() {
            res.redirect("/patients");
        })
})

router.get("/", function(req, res) {
    res.render("index");
});
router.get("/physician", function(req, res) {
    res.render("physician");
});

router.get("/calendar", function(req, res) {
    res.render("calendar");
});
// router.get("/view", function(req, res) {
//   res.render("viewPatient");
// });
router.get("/record", function(req, res) {
  res.render("healthRecord");
});
router.get("/login", function(req, res) {
  res.render("login");
});
router.get("/patient", function(req, res) {
  res.render("patientDash");
});
router.get("/mycare", function(req, res) {
  res.render("myCare");
});
router.get("/chatview", function(req, res) {
  res.render("chatview");
});

router.get("/specialists", function(req, res) {
    db.specialists.findAll().then((result) => {
        const hbsObject = { specialists: result };
        res.render("specialists", hbsObject);
    })
});

router.get("/specialists/add", function(req, res) {
    res.render("specialists_new");
  });

router.post("/specialists/add", (req, res) => {
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

router.delete("/specialists/delete/:id", function(req, res) {
    // We just have to specify which todo we want to destroy with "where"
    var theid = req.param.id;
    console.log(theid);

    db.specialists.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(result) {
        res.json({success:true, url: '/specialists'})
    });

  });

router.get("/ass", function(req, res) {
    db.doctors.findAll({
        where: { id: 1 },
        include: [
            { model: db.alerts}
        ]
    }).then(function(match) {
        res.json(match);
    });
    
// });
// router.get("/patients", function(req, res) {
//     db.doctors.findAll({
//         where: { id: 1 },
//         include: [
//             { model: db.alerts}
//         ]
//     }).then(function(result) {
//         const hbsObject = { specialists: result };
//         res.render("patients", hbsObject);
//     });
    
});

module.exports = router;