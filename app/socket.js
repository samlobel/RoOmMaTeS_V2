var models = require('../app/models/index.js');
var socketMessages = require('./socket_controllers/socketMessages.js');
var helperFunctions = require('./controllers/helperFunctions.js')




module.exports = function(io, user){
  // io.sockets.on('connect', function (socket) {
  io.sockets.on('connect', function(socket){
    var userID = user._id;
    helperFunctions.getGroupFromUserID(userID, function(err, group){
      console.log("in socket callback");
      if(err){
        console.log(err);
        return;
      }
      var groupID = group._id;
      console.log("group._id is " + groupID);
      socket.join(groupID);
      socket.on('send-message', function(data){
        console.log(data)
        console.log("RECEIVED MESSAGE");
        dataObj = data[0];
        messageObj = {
          sender : dataObj['_id'],
          body: dataObj['message'],
          timeStamp : new Date()
        }
        socketMessages.saveMessageToGroup(messageObj, function(err, message){
          if(err){
            console.log("saveMessage callback error:")
            console.log(err);
            return
          } else{
            console.log("about to send socket message");
            socket.broadcast.to(groupID).emit('send-message', data);
          }
        })
      })
    })
  });
  
  io.sockets.on('error', function(err){
    console.log("SOCKET ERROR: " + err);
  })
}



//       console.log("CONNECTED!");
      
//       socket.on('send-message', function(data) {
//           console.log(data)
//           console.log("RECEIVED MESSAGE");
//           dataObj = data[0];
//           messageObj = {
//             sender : dataObj['_id'],
//             body: dataObj['message'],
//             timeStamp : new Date()
//           }
//           socketMessages.saveMessageToGroup(messageObj, function(err, message){
//             if(err){
//               console.log("saveMessage callback error:")
//               console.log(err);
//               return
//             } else{
//               console.log("about to send socket message");
//               socket.broadcast.emit('send-message', data);
//             }
//           })
//       });
//   });

//   io.sockets.on('error', function(err){
//     console.log(err);
//   }); 
// }

