const express = require('express'),
    colors = require("colors"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    exphbs = require("express-handlebars"),
    routes = require("./controllers/ps_controller.js"),
    app = express(),
    port = process.env.PORT || 3000,
    fixtures = require('./scripts/fixture_patient'),
    db = require('./models'),
    session = require('express-session'),
    passport = require('./config/passport'),
    http = require('http').createServer(app),
    io = require('socket.io')(http);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Override with POST having ?_method=DELETE
app.use(methodOverride("_method"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use("/", routes);

let users = [];
let connections = [];

io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // disconnect
    socket.on('disconnect', data => {
        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
    })

    // send message
    socket.on('send message', data => {
        io.sockets.emit('new message', { msg: data });
        // socket.broadcast.emit('broad', data);
    })

    socket.on('join', data => {
        console.log(data);
        socket.emit('messages', 'Hello from server')
    })
})

db.sequelize.sync({ force: true })
    .then(fixtures)
    .then(() => {
        http.listen(port, () => { console.log(`==> 🌎 Listening on PORT ${port}. Visit http://localhost:${port}`.green) });
    });