var mongoose = require('mongoose');

var MessageSchema = mongoose.Schema({
  sender : {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  timeStamp : Date,
  body : String
});

module.exports = {schema : mongoose.model('Message', MessageSchema)};
