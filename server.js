const express = require('express'),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    exphbs = require("express-handlebars"),
    routes = require("./controllers/ps_controller.js"),
    app = express(),
    port = process.env.PORT || 3000,
    fixtures = require('./scripts/fixture_patient'),
    db = require('./models'),
    session = require('express-session'),
    passport = require('./config/passport');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", routes);

db.sequelize.sync({ force: true })
    .then(fixtures)
    .then(() => {
        app.listen(port, () => { console.log(` 🌎 listening on PORT ${port}`) });
    });