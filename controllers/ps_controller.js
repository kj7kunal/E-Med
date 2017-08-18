const express = require("express"),
    router = express.Router(),
    db = require('../models');

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/patients", function(req, res) {
    db.patient.findAll().then((result) => {
        console.log(result);
        var hbsObject = { patient: result };
        res.render("patients_list", hbsObject);
    })
})


module.exports = router;