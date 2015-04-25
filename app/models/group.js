var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
  users : [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  groupName : String,
  messages: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Message'
  }],
  payments : [{
    type: mongoose.Schema.ObjectId,
    ref: 'Payment'
  }]
});



module.exports = {schema : mongoose.model('Group', GroupSchema)};
