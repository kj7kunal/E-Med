$(() => {
    let socket = io.connect('http://localhost:3000');
    let messageForm = $("#messageForm");
    let message = $("#message");
    let chat = $("#chat");
    let typingmessage = $("#typingmessage");
    let username = "";


    $.get("/api/user_data", (req, res) => {
        console.log(req);
        username = req.email;
    });


    messageForm.submit(event => {
        event.preventDefault();
        socket.emit('send message', message.val(), username);

        message.val("");
        return false;
    })

    // keypress
    messageForm.on("keypress", (event) => {
        socket.emit('typing', username)
    })

    socket.on('connect', (data) => {
        console.log("we're connected!");
        socket.emit('join', 'Hello World from client');
    })

    socket.on('broad', (data) => {
        $('#chat').html(data);
        socket.emit('join', message.val());
    });
    socket.on('new message', (username, data) => {
        console.log(data.msg);

        chat.append('<div class="well"><b>' + username + ':  </b>' + data.msg + '</div>');
        typingmessage.html("");
    });
    socket.on('updateusers', data => {
        $('#users').empty();
        $.each(data, (key, value) => {
            $('#users').append('<div>' + key + '</div>');
        });
    });
    // keypress
    socket.on('typing', data => {
        typingmessage.html('<p><em>' + data + ' is typing a message...</em></p>');
    })

});