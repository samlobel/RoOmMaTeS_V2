var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')


module.exports = {


  getUsersGroupsUserList : function getUsersGroupUserList(req,res){
    var userID = req.user._id;
    helperFunctions.getGroupFromUserID(userID, {populateFields : "users"},
      function(err, group){
        if(!group){
          return res.send({isGroup : false});
        } else{
          return res.send({isGroup : true, groupUsers : group.users});
        }
      }
    );

  },
  
  isUserPartOfGroup : function isUserPartOfGroup(req,res){
    var userID = req.user._id;
    helperFunctions.getGroupFromUserID(userID, function(err, group){
      if(group){
        return res.send({answer : true});
      } else{
        return res.send({answer : false}); //maybe should have error handling, not sure.
      }
    })
  },


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


