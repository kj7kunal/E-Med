const express = require('express'),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    hbs = require('handlebars'),    
    exphbs = require("express-handlebars"),
    routes = require("./controllers/ps_controller.js"),
    app = express(),
    port = process.env.PORT || 3000,
    fixtures = require('./scripts/fixture_patient'),
    db = require('./models');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", routes);

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

db.sequelize.sync({ force: true })
    .then(fixtures)
    .then(() => {
        app.listen(port, () => { console.log(`App listening on PORT ${port}`) });
    });