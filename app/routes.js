var models = require('./models/index.js')
var _ = require('underscore')



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    console.log("Authenticated!")
    return next()
  } else{
    res.status(500).send({err: "isLoggedIn failed!"});
  }
}


function autocomplete(modelType, field, prefix, minLen, returnFields, callback){
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
}

module.exports = function(app, passport){

  app.post('/login', function(req,res){
    console.log("trying to log in");
    passport.authenticate('local-login', function(err, user, info){
      if(err){
        res.status(500).send({'err' : err });
      } else if(!user){
        res.status(500).send({'err' : "No User Found"});
      } else{//on success
        console.log("apparently successful, about to call login.");
        req.logIn(user, function(err){
          if(err){
            console.log("error in login: ", err);
            res.status(500).send({'err' : "failed in req.logIn"});
          } else{
            res.send(user);
          }
        });
      }
    })(req,res);
  });

  app.post('/register', function(req,res){
    console.log("Trying to register");
    passport.authenticate('local-register', function(err,user,info){
      if(err){
        res.status(500).send({"err":err});
      } else if(!user){
        res.status(500).send({"err" : "User found with that name"});
      } else{//on successs
        console.log("looks like successful, about to call logIn");
        req.logIn(user, function(err){
          if(err){
            res.status(500).send({"err": "failed in req.logIn, for register"});
          } else{
            res.send(user);
          }
        });
      }
    })(req,res)
  });

  app.get('/getUsers', isLoggedIn, function(req,res){
    console.log('getUsers called');
    //console.log(req);
    var modelType = 'User';
    var field = 'username';
    var minLen = 2;
    var prefix = req.query.prefix;
    var returnFields = ['username', '_id'];

    //this should send the response.
    autocomplete(modelType, field, prefix, minLen, returnFields, function(err,toSend){
      if(err){
        res.status(500).send({err: err})
      }else{
        res.send(toSend);
      }
    });
  })
  
}