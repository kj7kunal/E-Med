$(function() {
    let socket = io();

    let messageForm = $("#messageForm");
    let message = $("#message");
    let chat = $("#chat");

    messageForm.submit(event => {
        console.log("here!");
        event.preventDefault();
        socket.emit('send message', message.val());
        messageForm.val();
        return false;
    })
})