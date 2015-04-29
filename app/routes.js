var models = require('./models/index.js')
var _ = require('underscore')
var async = require('async')
var groupMethods = require('./controllers/groupMethods.js');
var messageMethods = require('./controllers/messageMethods');
var userMethods = require('./controllers/userMethods');


module.exports = function(app, passport){

  app.get('/getUsersWithPrefix', userMethods.getUsersWithPrefix);

  app.get('/isUserPartOfGroup', groupMethods.isUserPartOfGroup);

  app.get('/getGroupMembers', groupMethods.getGroupMembers);


  app.post('/createNewGroup', groupMethods.createNewGroup);



  app.post('/addMembersToGroup', groupMethods.addMembersToGroup);

  
  app.get('/getMessages', messageMethods.getMessages);


  app.post('/newMessage', messageMethods.newMessage);

}



