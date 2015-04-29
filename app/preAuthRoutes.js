var models = require('./models/index.js')
var _ = require('underscore')


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


  app.get('/venmo-auth', function(req,res){
    console.log("Registering venmo");
    var error = req.query.error;
    if(error){
      console.log(error);
      return res.redirect('RoommatesApp://');

    }
  });

}

