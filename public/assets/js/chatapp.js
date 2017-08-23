$(() => {
    let socket = io.connect('http://localhost:3000'),
        messageForm = $("#messageForm"),
        message = $("#message"),
        typingmessage = $("#typingmessage"),
        username = "",
        avatar = "",
        mainContain = $("#main-container")


    $.get("/api/user_data", (req, res) => {
        // console.log(req);
        username = req.username;
        avatar = req.avatar;
    });

    messageForm.submit(() => {
        socket.emit('send message', message.val(), username, avatar);

        $.get("/chatview", (req, res) => {
            return;
        })
        message.val("");
    })

    // keypress
    messageForm.on("keypress", event => {
        socket.emit('typing', username)
    })

    socket.on('connect', data => {
        console.log("we're connected!");
        socket.emit('join', 'Hello World from client');
    })

    socket.on('broad', data => {
        $('#chat').html(data);
        socket.emit('join', message.val());
    });
    socket.on('new message', (username, avatar, data) => {
        console.log("avater: " + avatar);

        mainContain.append('<div class="comment"><a class="avatar"><img src="' + avatar + '"></a><div class="content"><a class="author">' + username + '</a><div class="metadata"><span class="date"></span></div><div class="text">' + data.msg + '</div></div></div>');
        typingmessage.html("");
    });

    // keypress
    socket.on('typing', data => {
        typingmessage.html('<p><em>' + data + ' is typing a message...</em></p>');
    })

    // // private chat - bob
    // bobSocket.on('connect', data => {
    //     console.log("Bob Socket is connected!");
    // })

});