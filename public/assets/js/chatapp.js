$(() => {
    let socket = io(),
        messageForm = $("#messageForm"),
        message = $("#message"),
        typingmessage = $("#typingmessage"),
        username = "",
        avatar = "",
        mainContain = $("#main-container")

    // store user data from API
    $.get("/api/user_data", (req, res) => {
        username = req.username;
        avatar = req.avatar;
    });

    socket.on('connect', data => {
        socket.emit('join', 'Hello World from client');
    })

    socket.on('broad', data => {
        $('#chat').html(data);
        socket.emit('join', message.val());
    });

    messageForm.submit(() => {
        socket.emit('send message', message.val(), username, avatar);

        $.get("/chatview", (req, res) => {
            return;
        })
        message.val("");
    })

    socket.on('new message', (username, avatar, data) => {
        mainContain.append('<div class="comment"><a class="avatar"><img src="' + avatar + '"></a><div class="content"><a class="author">' + username + '</a><div class="metadata"><span class="date"></span></div><div class="text">' + data.msg + '</div></div></div>');
        typingmessage.html("");
    });

    // keypress
    socket.on('typing', data => {
        typingmessage.html('<p><em>' + data + ' is typing a message...</em></p>');
    })
    messageForm.on("keypress", event => {
        socket.emit('typing', username)
    })
});