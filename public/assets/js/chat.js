// socket.on(‘event name’, function(msg){});
console.log("sup");

// socket.emit('event name', message);
var socket = io.connect('http://localhost:3000');
$("#sendMes").on("click", (event) => {
    event.preventDefault();
    console.log("yup");
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});