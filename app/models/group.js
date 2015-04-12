var mongoose = require('mongoose');

var GroupSchema = mongoose.Schema({
  users : [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
});

module.exports = {schema : mongoose.model('Group', GroupSchema)};
