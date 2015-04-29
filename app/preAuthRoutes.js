var models = require('./models/index.js')
var _ = require('underscore')
var socket = require('./socket.js');
var request = require('request');



module.exports = function(app, passport){

/* Login Routes */
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
            // console.log("just logged in, see if we connect")
            // socket(io, user); //this connects to the group we're in.
            //no group, no socket, but no biggie.
            // console.log("after socket, before res.send")
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


/* Venmo Routes */
  
  app.get('/venmo-auth', function(req,res){
    console.log('Venmo tried to authorize');

    // Venmo unauthorized
    var error = req.query.error;
    if(error){
      console.log(error);
      return res.redirect('RoommatesApp://');
    }

    console.log('Venmo use authorized');
    console.log(req.query);

    // Post auth data to venmo
    var data = {
      'client_id' : '2583',
      'client_secret' : 'PcY324UY8Fdhs3RCsUR5c4Nthd2Hy6Mx',
      'code' :  req.query.code
    }
    var url = 'https://api.venmo.com/v1/oauth/access_token';
    request.post(
      url,
      data,
      function (err, res, body) {
        if (!error && res.statusCode == 200) {
            console.log('Got venmo credentials');
            console.log(body);
            res.redirect('RoommatesApp://');


            // Save credentials
        } else {
          console.log(res.statusCode);
          console.log(err);
          res.redirect('RoommatesApp://');
        }
      });

    // Return to app
    // console.log("Throw redirect");
    // res.redirect('RoommatesApp://');

  });

}

