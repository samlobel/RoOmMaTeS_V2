var models = require('./models/index.js')
var _ = require('underscore')
var async = require('async')



// function isLoggedIn(req,res,next){
//   if(req.isAuthenticated()){
//     console.log("Authenticated!")
//     return next()
//   } else{
//     res.status(500).send({err: "isLoggedIn failed!"});
//   }
// }


function autocomplete(modelType, field, prefix, minLen, returnFields, callback){
  //return fields are what you want the returning array to be composed of.


  //IMPORTANT NOTE: AUTOCORRECT MIGHT BREAK IF THE RETURNFIELDS NAMES HAVE SPACES IN THEM.
  function filterObj(obj, fieldsWeWant){
    var toReturn = {}
    fieldsWeWant.forEach(function(elem, index){
      toReturn[elem] = obj[elem];
    })
    return toReturn;
  }
  var ModelMap = {
    'User' : models.User,
    'Group' : models.Group
  }

  if(prefix.length < minLen){
    if(callback){
      callback(null, []);
      return;
    } else{
      return [];
    }
  }

  var model = ModelMap[modelType];
  if(!model){
    throw "Not a model!";
  }
  var aRegex = new RegExp('^' + prefix, 'i');
  console.log(aRegex);
  var returnFieldString = returnFields.join(' ');
  console.log(returnFieldString);
  var finderParameter = {}
  finderParameter[field] = {$regex : aRegex}
  console.log(finderParameter)
  model.find(finderParameter).
    select(returnFieldString).
    limit(20).
    exec(function(err, returnedArr){
      console.log(returnedArr);
      if(err){
        console.log(err)
        callback(err)
      } else{
        if(!returnFields){
          console.log('no returnFields!')
          if(callback){
            callback({err: "No Return Fields specified"})
            return;
          }
          else{
            return[]
          }
        } else{
          // _.map(returnedArr, function(elem){
          //   return filterObj(elem, returnFields);
          // }){

          // });
          var toReturn = _.map(returnedArr, function(elem){
            return filterObj(elem, returnFields);
          })
          console.log("To return: ", toReturn);
          if(callback){
            callback(null, toReturn);
            return;
          }else{
            return toReturn;
          }
        }
      }

    })
}

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

  app.get('/getUsers', function(req,res){
    console.log('getUsers called');
    //console.log(req);
    var modelType = 'User';
    var field = 'username';
    var minLen = 2;
    var prefix = req.body.prefix;
    var returnFields = ['username', '_id'];

    //this should send the response.
    autocomplete(modelType, field, prefix, minLen, returnFields, function(err,toSend){
      if(err){
        res.status(500).send({err: err})
      }else{
        res.send(toSend);
      }
    });
  })

  app.post('/createNewGroup', function(req,res){
    /*

                            UNTESTED
    

    */
    var groupName = req.body.name;
    var groupMembers = req.body.members;
    //probably should validate that both of these exist first.
    if(!groupName){
      return res.status(500).send({err : "Missing Group Name"});
    }
    if(!groupMembers || !groupMembers.length){
      return res.status(500).send({err : "no members!"});
    } //also should check if the group members all exist.
    var memberIDs = _.map(groupMembers, function(member){
      return member._id;
    })

    var newGroup = new models.Group({
      groupName : groupName,
      users: memberIDs
    })

    newGroup.save(function(err, group){
      if(err){
        return res.status(500).send({err: "error in saving new group"})
      } else{
        return res.send(group)
      }
    })
  })


  app.post('/addMembersToGroup', function(req,res){
    /*

                            UNTESTED
    

    */

    //INVARIANT: NO GROUP SHOULD EVER HAVE NO MEMBERS. IT BECOMES INACCESSIBLE
    var userID = req.user._id;
    models.User.findById(userID, function(err, user){
      if(err){
        console.log(err)
        return res.status(500).send(err);
      }
      user.getGroup(function(err2, group){
        if(err2){
          console.log(err2);
          return res.status(500).send(err2);
        }
        var newMembers= req.body.newMembers;
        var memberIDs = _.pluck(newMembers, '_id');
        group.users.addToSet(memberIDs);
        group.save(function(err3, groupAgain){
          if(err3){
            console.log(err3)
            return res.status(500).send(err3);
          }
          return res.send(groupAgain);
        })
      })
      
    });
  });
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

  

  app.get('/messages', function(req, res){
    //I think that req.user is what we want.
  })






}