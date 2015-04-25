var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')

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
//   )
// }


module.exports = {


  createNewGroup : function createNewGroup(req,res){
    /*

                            UNTESTED
    

    */
    /*
    Makes a new group with the user, and a list of people who the user
    wants to be in the group. Should send over a string called groupName,
    and a list of members called members. Maybe just their IDS, in which
    case we have to change it up just a little.

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
    memberIDs.push(req.user._id);//add yourself to that list.

    var newGroup = new models.Group({
      groupName : groupName,
      users: memberIDs,
      messages : []
    })

    newGroup.save(function(err, group){
      if(err){
        return res.status(500).send({err: "error in saving new group"})
      } else{
        return res.send(group)
      }
    })
  },


  addMembersToGroup: function addMembersToGroup(req,res){
    /*

                            UNTESTED
    

    */

    //INVARIANT: NO GROUP SHOULD EVER HAVE NO MEMBERS. IT BECOMES INACCESSIBLE

    var userID = req.user._id;
    
    //fetches group, and then adds to its users array, and then saves.
    helperFunctions.getGroupFromUserID(userID, function(err, group){
      if(err){
        console.log(err)
        return res.status(500).send(err);
      }
      var newMembers = req.body.newMembers;
      if(!newMembers || !newMembers.length){
        return res.status(500).send({err: "no new members to add"});
      }
      var memberIDs = _.pluck(newMembers, '_id'); //array of ids.
      group.users.addToSet(memberIDs);
      group.save(function(err2, groupAgain){
        if(err2){
          console.log(err2)
          return res.status(500).send(err2);
        }
        return res.send(groupAgain);
      })
    });
  }




}


