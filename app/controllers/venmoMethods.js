var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')



// GET /venmo-auth?error=User+denied+your+application+access+to+his+or+her+protected+resources. 500 1.028 ms - 28
// that was what venmo sent when I hit "deny"

module.exports = {
  
  venmoValidated: function venmoValidated(req, res){
    var userID = req.user._id;

    console.log("CHECK VENMO VALIDATED");
    console.log(userID);

    // Lookup THIS user

    // Respond with res.send({answer: yes});

  }

}