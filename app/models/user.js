var mongoose = require('mongoose');;
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  username    : String,
  password    : String,
  venmo : {
    access_token : String,
    expires_in : Date,
    refresh_token : String,
    profile_picture_url : String,
    username: String,
    balance: String
  }
});


userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = {schema : mongoose.model('User', userSchema)};




