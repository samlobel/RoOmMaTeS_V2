var models = require('../models/index.js')
var helperFunctions = require('../controllers/helperFunctions.js')


 // newMessage: function newMessage(req,res){
 //    var userID = req.user._id;
 //    var messageBody = req.body.messageBody; //Should be 
 //    if(!messageBody){
 //      return res.status.send({err: "No message body sent"})
 //    }
 //    helperFunctions.getGroupFromUserID(userID, function(err, group){
 //      if(err){
 //        console.log(err)
 //        return res.status(500).send(err);
 //      }
 //      var newMessage = new models.Message({
 //        sender : userID,
 //        body: messageBody,
 //        timeStamp : new Date()
 //      });
 //      //I think I just need to add it to the group, and save the group...
 //      group.messages.push(newMessage);
 //      group.save(function(err2, groupAgain){
 //        if(err2){
 //          return res.status(500).send(err2);
 //        }
 //        return res.send(newMessage);
 //      });
 //    })
 //  }




module.exports = {

  saveMessageToGroup : function saveMessageToGroup(messageObject, callback){
    var userID = messageObject.sender;
    helperFunctions.getGroupFromUserID(userID, function(err, group){
      if(err){
        console.log(err);
        return callback(err, null);
      }
      var newMessage = new models.Message(messageObject);
      group.messages.push(newMessage);
      group.save(function(err2){
        if(err2){
          console.log("err in save");
          console.log(err2);
          return callback(err2, null)
        }
        console.log("message saved successfully");
        return callback(null, newMessage);
      })
    })

  }
}