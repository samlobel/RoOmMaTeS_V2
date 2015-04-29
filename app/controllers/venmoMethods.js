var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')



// GET /venmo-auth?error=User+denied+your+application+access+to+his+or+her+protected+resources. 500 1.028 ms - 28
// that was what venmo sent when I hit "deny"

module.exports = {
  
  hasBeenVenmoValidated: function hasBeenVenmoValidated(req, res){
    var userID = req.user._id;
    console.log("user id: ", userID);
    models.User.findById(userID, function(err, user){
      if (err){
        console.log(err)
        return res.send({'answer' : false, 'err': err});
      }
      if(user.venmo){
        console.log("user has venmo")
        return res.send({'answer' : true, "venmo" : user.venmo});
      }
    });

  }

}