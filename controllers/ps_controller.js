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
// router.get("/view", function(req, res) {
//   res.render("viewPatient");
// });
router.get("/record", function(req, res) {
  res.render("healthRecord");
});
router.get("/login", function(req, res) {
  res.render("login");
});

module.exports = router;