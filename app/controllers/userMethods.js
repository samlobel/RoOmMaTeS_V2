var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')


module.exports = {
  getUsersWithPrefix : function getUsers(req,res){
    /*
      get users whose name starts with a certain prefix.
    */
    console.log('getUsers called');
    console.log("body next ");
    console.log(req.body)
    //console.log(req);
    var modelType = 'User';
    var field = 'username';
    var minLen = 2;
    var prefix = req.query.prefix;
    var returnFields = ['username', '_id'];

    //this should send the response.
    helperFunctions.autocomplete(modelType, field, prefix, minLen, returnFields, function(err,toSend){
      if(err){
        console.log(err)
        res.status(500).send({err: err})
      }else{
        console.log(toSend);
        res.send(toSend);
      }
    });
  }

}