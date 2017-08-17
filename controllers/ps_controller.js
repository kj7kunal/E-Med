const express = require("express"),
    router = express.Router();

router.get("/", function(req, res) {
    res.render("index");
});
router.get("/physician", function(req, res) {
    res.render("physician");
});


module.exports = router;