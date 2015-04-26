

module.exports = function(io){
  io.sockets.on('connect', function (socket) {
      console.log("CONNECTED!");
      
      socket.on('send-message', function(data) {
          console.log("RECEIVED MESSAGE");
          socket.emit('send-message', data);
          socket.broadcast.emit('send-message', data);
      });
  }); 
}