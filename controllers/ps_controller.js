const express = require("express"),
    router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
});
router.get("/physician", function(req, res) {
    res.render("physician");
});
router.get("/view", function(req, res) {
  res.render("viewPatient");
});
router.get("/record", function(req, res) {
  res.render("healthRecord");
});


module.exports = router;