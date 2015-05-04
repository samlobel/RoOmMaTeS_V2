var models = require('../models/index.js')
var _ = require('underscore')
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = {
    
  autocomplete: function autocomplete(modelType, field, prefix, minLen, returnFields, callback){
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
  },
  
  getGroupFromUserID: function getGroupFromUserID(userID, options, callback){
    /*
    SUPPORTED OPTIONS:
    -populateFields : space-delimited list of fields that you want to populate with objects.
    */

    /*
    there's some trickiness here, because they won't always inclide options. But you should
    always include callback.
    */

    if (typeof options == 'function'){
      callback = options;
      options = {};
    }
    safeOptions = options || {}
    safeOptions.populateFields = safeOptions.populateFields || ""

    console.log(userID);
    
    models.Group.find({users : new ObjectId(userID)})
      .populate(safeOptions.populateFields)
      .exec(function(err, groups){
        //finds a group that has this user in its array.
        // console.log(groups)
        if(err){
          console.log(err);
          return callback(err, null);
        }
        if(!groups || !groups.length){
          console.log("no group")
          return callback({err: "No group"}, null)
        }
        if(groups.length > 1){
          console.log("too many groups");
          return callback({err: "Too many groups"}, null)
        }
        //if all is well, return callback. Standard callback signature.
        console.log("one group found");
        return callback(null, groups[0]);
      }
    )
  }

}