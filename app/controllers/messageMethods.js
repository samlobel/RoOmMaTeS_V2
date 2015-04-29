var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')


module.exports = {
  
  getMessages : function getMessages(req, res){
    //I think that req.user is what we want.


    var userID = req.user._id;
    var options = {populateFields : 'messages'};
    //fetches group, populates its messages, and then returns them.
    helperFunctions.getGroupFromUserID(userID, options, function(err, group){
      if(err){
        console.log(err)
        return res.status(500).send(err);
      }
      console.log(group)
      var messages = group.messages;
      console.log(messages)
      messages = messages ? messages : [];
      return res.send(messages);
    })
  },

 newMessage: function newMessage(req,res){
    var userID = req.user._id;
    var messageBody = req.body.messageBody; //Should be 
    if(!messageBody){
      return res.status.send({err: "No message body sent"})
    }
    helperFunctions.getGroupFromUserID(userID, function(err, group){
      if(err){
        console.log(err)
        return res.status(500).send(err);
      }
      var newMessage = new models.Message({
        sender : userID,
        body: messageBody,
        timeStamp : new Date()
      });
      //I think I just need to add it to the group, and save the group...
      group.messages.push(newMessage);
      group.save(function(err2, groupAgain){
        if(err2){
          return res.status(500).send(err2);
        }
        return res.send(newMessage);
      });
      // newMessage.save(function(err2, message){
      //   if(err2){
      //     return res.status(500).send(err2);
      //   }
      //   group.messages.append()
      //   return res.send(message)
      // })

    })
  }


}