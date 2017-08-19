const express = require('express'),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    exphbs = require("express-handlebars"),
    routes = require("./controllers/ps_controller.js"),
    app = express(),
    port = process.env.PORT || 3000,
    fixtures = require('./scripts/fixture_patient'),
    db = require('./models'),
    server = require("http").createServer(app),
    io = require('socket.io')(server);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", routes);

io.on('connection', (socket) => {
    console.log('user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

db.sequelize.sync({ force: true })
    .then(fixtures)
    .then(() => {
        app.listen(port, () => { console.log(`App listening on PORT ${port}`) });
    });