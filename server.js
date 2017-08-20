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

let usernames = {};
let connections = [];

io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log("Connected: %s sockets connected", connections.length);

    // disconnect
    socket.on('disconnect', data => {

        connections.splice(connections.indexOf(socket), 1);
        console.log("Disconnected: %s sockets connected", connections.length);
        // remove the username from global usernames list
        delete usernames[socket.username];
        // update list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
    });


    // send message
    socket.on('send message', data => {
        io.sockets.emit('new message', socket.username, { msg: data });
        // socket.broadcast.emit('broad', data);
    })

    socket.on('join', data => {
        console.log(data);
        socket.emit('messages', 'Hello from server')
    })

    socket.on('adduser', (username) => {
        // we store the username in the socket session for this client
        socket.username = username;
        // add the client's username to the global list
        usernames[username] = username;
        // echo to client they've connected
        socket.emit('updatechat', 'SERVER', 'you have connected');
        // echo globally (all clients) that a person has connected
        socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
        // update the list of users in chat, client-side
        io.sockets.emit('updateusers', usernames);
    });

});


db.sequelize.sync({ force: true })
    .then(fixtures)
    .then(() => {
        http.listen(port, () => { console.log(`==> 🌎 Listening on PORT ${port}. Visit http://localhost:${port}`.green) });
    });