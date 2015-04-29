var models = require('../app/models/index.js');
var socketMessages = require('./socket_controllers/socketMessages.js');




module.exports = function(io){
  io.sockets.on('connect', function (socket) {
      console.log("CONNECTED!");
      
      socket.on('send-message', function(data) {
          console.log("RECEIVED MESSAGE");
          dataObj = data[0];
          messageObj = {
            sender : dataObj['user_id'],
            body: dataObj['message'],
            timeStamp : new Date()
          }
          socketMessages.saveMessageToGroup(messageObj, function(err, message){
            if(err){
              console.log(err);
              return
            } else{
              console.log("about to send socket message");
              socket.emit('send-message', data);
            }
          })

          // message = new models.Message(messageObj);
          // message.save(function(err){
          //   if(err){
          //     console.log(err);
          //     return;
          //   }
          //   else{
          //     console.log("successful save!");
          //     socket.emit('send-message', data);
          //     return;
          //   }
          // })
          // // socket.emit('send-message', data);
      });

  });

  io.sockets.on('error', function(err){
    console.log(err);
  }); 
}

