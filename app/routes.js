var models = require('./models/index.js')
var _ = require('underscore')
var async = require('async')
var groupMethods = require('./controllers/groupMethods.js');
var messageMethods = require('./controllers/messageMethods');
var userMethods = require('./controllers/userMethods');


// function isLoggedIn(req,res,next){
//   if(req.isAuthenticated()){
//     console.log("Authenticated!")
//     return next()
//   } else{
//     res.status(500).send({err: "isLoggedIn failed!"});
//   }
// }



// function getGroupFromUserID(userID, options, callback){
//   /*
//   SUPPORTED OPTIONS:
//   -populateFields : space-delimited list of fields that you want to populate with objects.
//   */

//   /*
//   there's some trickiness here, because they won't always inclide options. But you should
//   always include callback.
//   */

//   if (typeof options == 'function'){
//     callback = options;
//     options = {};
//   }
//   safeOptions = options || {}
//   safeOptions.populateFields = safeOptions.populateFields || ""
  
//   models.Group.find({'users.id' : userID})
//     .populate(safeOptions.populateFields)
//     .exec(function(err, groups){
//     //finds a group that has this user in its array.
//       if(err){
//         console.log(err);
//         return callback(err, null);
//       }
//       if(!groups || !groups.length){
//         console.log("no group")
//         return callback({err: "No group"}, null)
//       }
//       if(groups.length > 1){
//         console.log("too many groups");
//         return callback({err: "Too many groups"}, null)
//       }
//       //if all is well, return callback. Standard callback signature.
//       console.log("one group found");
//       return callback(null, groups[0]);
//     }
//   );
// }

  //group isn't in user model. So we need a fetch method. It's not so bad though.
  // models.Group.find({'users.id' : userID}, function(err, groups){
  //   //finds a group that has this user in its array.
  //   if(err){
  //     console.log(err)
  //     return callback(err, null);
  //   }
  //   if(!groups || !groups.length){
  //     console.log("no group")
  //     return callback({err: "No group"}, null)
  //   }
  //   if(groups.length > 1){
  //     console.log("too many groups");
  //     return callback({err: "Too many groups"}, null)
  //   }
  //   //if all is well, return callback. Standard callback signature.
  //   console.log("one group found");
  //   return callback(null, groups[0]);
  // })
// }


// function autocomplete(modelType, field, prefix, minLen, returnFields, callback){
//   //return fields are what you want the returning array to be composed of.


//   //IMPORTANT NOTE: AUTOCORRECT MIGHT BREAK IF THE RETURNFIELDS NAMES HAVE SPACES IN THEM.
//   function filterObj(obj, fieldsWeWant){
//     var toReturn = {}
//     fieldsWeWant.forEach(function(elem, index){
//       toReturn[elem] = obj[elem];
//     })
//     return toReturn;
//   }
//   var ModelMap = {
//     'User' : models.User,
//     'Group' : models.Group
//   }

//   if(prefix.length < minLen){
//     if(callback){
//       callback(null, []);
//       return;
//     } else{
//       return [];
//     }
//   }

//   var model = ModelMap[modelType];
//   if(!model){
//     throw "Not a model!";
//   }
//   var aRegex = new RegExp('^' + prefix, 'i');
//   console.log(aRegex);
//   var returnFieldString = returnFields.join(' ');
//   console.log(returnFieldString);
//   var finderParameter = {}
//   finderParameter[field] = {$regex : aRegex}
//   console.log(finderParameter)
//   model.find(finderParameter).
//     select(returnFieldString).
//     limit(20).
//     exec(function(err, returnedArr){
//       console.log(returnedArr);
//       if(err){
//         console.log(err)
//         callback(err)
//       } else{
//         if(!returnFields){
//           console.log('no returnFields!')
//           if(callback){
//             callback({err: "No Return Fields specified"})
//             return;
//           }
//           else{
//             return[]
//           }
//         } else{
//           // _.map(returnedArr, function(elem){
//           //   return filterObj(elem, returnFields);
//           // }){

//           // });
//           var toReturn = _.map(returnedArr, function(elem){
//             return filterObj(elem, returnFields);
//           })
//           console.log("To return: ", toReturn);
//           if(callback){
//             callback(null, toReturn);
//             return;
//           }else{
//             return toReturn;
//           }
//         }
//       }

//     })
// }

module.exports = function(app, passport){

  // app.post('/login', function(req,res){
  //   console.log("trying to log in");
  //   passport.authenticate('local-login', function(err, user, info){
  //     if(err){
  //       res.status(500).send({'err' : err });
  //     } else if(!user){
  //       res.status(500).send({'err' : "No User Found"});
  //     } else{//on success
  //       console.log("apparently successful, about to call login.");
  //       req.logIn(user, function(err){
  //         if(err){
  //           console.log("error in login: ", err);
  //           res.status(500).send({'err' : "failed in req.logIn"});
  //         } else{
  //           res.send(user);
  //         }
  //       });
  //     }
  //   })(req,res);
  // });

  // app.post('/register', function(req,res){
  //   console.log("Trying to register");
  //   passport.authenticate('local-register', function(err,user,info){
  //     if(err){
  //       res.status(500).send({"err":err});
  //     } else if(!user){
  //       res.status(500).send({"err" : "User found with that name"});
  //     } else{//on successs
  //       console.log("looks like successful, about to call logIn");
  //       req.logIn(user, function(err){
  //         if(err){
  //           res.status(500).send({"err": "failed in req.logIn, for register"});
  //         } else{
  //           res.send(user);
  //         }
  //       });
  //     }
  //   })(req,res)
  // });

  app.get('/getUsers', userMethods.getUsers);

  // app.get('/getUsers', function(req,res){
  //   /*
  //     get users whose name starts with a certain prefix.
  //   */
  //   console.log('getUsers called');
  //   //console.log(req);
  //   var modelType = 'User';
  //   var field = 'username';
  //   var minLen = 2;
  //   var prefix = req.body.prefix;
  //   var returnFields = ['username', '_id'];

  //   //this should send the response.
  //   autocomplete(modelType, field, prefix, minLen, returnFields, function(err,toSend){
  //     if(err){
  //       res.status(500).send({err: err})
  //     }else{
  //       res.send(toSend);
  //     }
  //   });
  // })

  app.post('/createNewGroup', groupMethods.createNewGroup);

  // app.post('/createNewGroup', function(req,res){
  //   /*

  //                           UNTESTED
    

  //   */
  //   /*
  //   Makes a new group with the user, and a list of people who the user
  //   wants to be in the group. Should send over a string called groupName,
  //   and a list of members called members. Maybe just their IDS, in which
  //   case we have to change it up just a little.

  //   */

  //   var groupName = req.body.name;
  //   var groupMembers = req.body.members;
  //   //probably should validate that both of these exist first.
  //   if(!groupName){
  //     return res.status(500).send({err : "Missing Group Name"});
  //   }
  //   if(!groupMembers || !groupMembers.length){
  //     return res.status(500).send({err : "no members!"});
  //   } //also should check if the group members all exist.
  //   var memberIDs = _.map(groupMembers, function(member){
  //     return member._id;
  //   })
  //   memberIDs.push(req.user._id);//add yourself to that list.

  //   var newGroup = new models.Group({
  //     groupName : groupName,
  //     users: memberIDs,
  //     messages : []
  //   })

  //   newGroup.save(function(err, group){
  //     if(err){
  //       return res.status(500).send({err: "error in saving new group"})
  //     } else{
  //       return res.send(group)
  //     }
  //   })
  // })


  app.post('/addMembersToGroup', groupMethods.addMembersToGroup);

  // app.post('/addMembersToGroup', function(req,res){
  //   /*

  //                           UNTESTED
    

  //   */

  //   //INVARIANT: NO GROUP SHOULD EVER HAVE NO MEMBERS. IT BECOMES INACCESSIBLE

  //   var userID = req.user._id;
    
  //   //fetches group, and then adds to its users array, and then saves.
  //   getGroupFromUserID(userID, function(err, group){
  //     if(err){
  //       console.log(err)
  //       return res.status(500).send(err);
  //     }
  //     var newMembers = req.body.newMembers;
  //     if(!newMembers || !newMembers.length){
  //       return res.status(500).send({err: "no new members to add"});
  //     }
  //     var memberIDs = _.pluck(newMembers, '_id'); //array of ids.
  //     group.users.addToSet(memberIDs);
  //     group.save(function(err2, groupAgain){
  //       if(err2){
  //         console.log(err2)
  //         return res.status(500).send(err2);
  //       }
  //       return res.send(groupAgain);
  //     })
  //   });
  // });


  //   models.User.findById(userID, function(err, user){
  //     if(err){
  //       console.log(err)
  //       return res.status(500).send(err);
  //     }
  //     user.getGroup(function(err2, group){
  //       if(err2){
  //         console.log(err2);
  //         return res.status(500).send(err2);
  //       }
  //       var newMembers= req.body.newMembers;
  //       var memberIDs = _.pluck(newMembers, '_id');
  //       group.users.addToSet(memberIDs);
  //       group.save(function(err3, groupAgain){
  //         if(err3){
  //           console.log(err3)
  //           return res.status(500).send(err3);
  //         }
  //         return res.send(groupAgain);
  //       })
  //     })
      
  //   });
  // });
    // user.getGroup()
    // if(!groupWeWant){
    //   return req.status(500).send({err: "something went wrong in fetching group"});
    // }
    // var groupMembers = req.body.newMembers;
    // var memberIDs = _.map(groupMembers, function(member){
    //   return member._id
    // })
    // groupWeWant.users.addToSet(memberIDs); //REALLY NOT SURE THIS IS RIGHT. It's
    //                                        //pushing strings, not objects

    // groupWeWant.save(function(err))



    // // var query = models.Group.


    // var groupID = req.body ? (req.body.group ? req.body.group._id : null) :
    //                         null;
    

    // if(!groupID || !groupMembers){
    //   return res.status(500).send({err: "Error from addMembersToGroup"});
    // }

    // var memberIDs = _.map(groupMembers, function(member){
    //   return member._id
    // })

    // models.Group.findById(groupID, function(err, group){
    //   if(err){
    //     return res.status(500).send({err: "Error fetching group in addMembers"});
    //   }
    //   if(!group.users || !group.users.length){ // if there's none there
    //     group.users = groupMembers;
    //     group.save(function(err2, groupAgain){
    //       if(err2){
    //         return res.status(500).send(err2);
    //       }
    //       return res.send({_id: groupID}); //Not sure if I really need to send this back...
    //     })
    //   } else{
    //     group.users.addToSet(memberIDs);//I think that's how it works.
    //     group.save(function(err2, groupAgain){
    //       if(err2){
    //         return res.status(500).send(err2);
    //       }
    //       return res.send({_id:groupID})
    //     })
    //   }

    // })
  // });

  
  app.get('/getMessages', messageMethods.getMessages);


  // app.get('/messages', function(req, res){
  //   //I think that req.user is what we want.


  //   var userID = req.user._id;
  //   var options = {populateFields : 'messages'};
  //   //fetches group, populates its messages, and then returns them.
  //   getGroupFromUserID(userID, options, function(err, group){
  //     if(err){
  //       console.log(err)
  //       return res.status(500).send(err);
  //     }
  //     var messages = group.messages;
  //     messages = messages ? messages : [];
  //     return res.send(messages);
  //   })
  // })

  app.post('/newMessage', messageMethods.newMessage);

  // app.post('/newMessage', function(req,res){
  //   var userID = req.user._id;
  //   var messageBody = req.body.messageBody; //Should be 
  //   if(!messageBody){
  //     return res.status.send({err: "No message body sent"})
  //   }
  //   getGroupFromUserID(userID, function(err, group){
  //     if(err){
  //       console.log(err)
  //       return res.status(500).send(err);
  //     }
  //     var newMessage = new models.Message({
  //       sender : userID,
  //       body: messageBody,
  //       timeStamp : new Date()
  //     });
  //     //I think I just need to add it to the group, and save the group...
  //     group.messages.push(newMessage);
  //     group.save(function(err2, groupAgain){
  //       if(err2){
  //         return res.status(500).send(err2);
  //       }
  //       return res.send(newMessage);
  //     });
  //     // newMessage.save(function(err2, message){
  //     //   if(err2){
  //     //     return res.status(500).send(err2);
  //     //   }
  //     //   group.messages.append()
  //     //   return res.send(message)
  //     // })

  //   })
  // })


  //     var newMembers = req.body.newMembers;
  //     if(!newMembers || !newMembers.length){
  //       return res.status(500).send({err: "no new members to add"});
  //     }
  //     var memberIDs = _.pluck(newMembers, '_id'); //array of ids.
  //     group.users.addToSet(memberIDs);
  //     group.save(function(err2, groupAgain){
  //       if(err2){
  //         console.log(err2)
  //         return res.status(500).send(err2);
  //       }
  //       return res.send(groupAgain);
  //     })
  //   });
  // }

  //   var userID = req.user._id;

  //   models.User.findById(userID, function(err, user){
  //     if(err){
  //       console.log(err)
  //       return res.status(500).send(err);
  //     }
  //     user.getGroup(function(err2, group){
  //       if(err2){
  //         console.log(err2);
  //         return res.status(500).send(err2);
  //       }
  //       var newMembers= req.body.newMembers;
  //       var memberIDs = _.pluck(newMembers, '_id');
  //       group.users.addToSet(memberIDs);
  //       group.save(function(err3, groupAgain){
  //         if(err3){
  //           console.log(err3)
  //           return res.status(500).send(err3);
  //         }
  //         return res.send(groupAgain);
  //       })
  //     })
      
  //   });

  // })

}



