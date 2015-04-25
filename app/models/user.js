var mongoose = require('mongoose');;
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  username    : String,
  password    : String
});

userSchema.methods.getGroup = function(callback){
  //callback with err, group form
  this.model('Group').find({'users.id' : this._id}, function(err, groups){
    if(err){
      console.log(err);
      return callback(err, null)
    }
    if (!groups.length){
      console.log("no groups match")
      return callback({err: "No Match"}, null);
    }

    if(groups.length > 1){
      console.log(groups.length + " group matches");
      return callback({err: groups.length + " groups match"}, null);
    }
    //finally:
    console.log("one group found");
    return callback(null, groups[0]);
  });
}


userSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = {schema : mongoose.model('User', userSchema)};




