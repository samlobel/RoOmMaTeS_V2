var models = require('../models/index.js')
var _ = require('underscore')
var helperFunctions = require('./helperFunctions')


module.exports = {
  getUsers : function getUsers(req,res){
    /*
      get users whose name starts with a certain prefix.
    */
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
  }

}