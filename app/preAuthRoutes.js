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

  function makeUserVenmoFromBody(body){
    console.log(body.user);
    var toReturn = {
      access_token : body.access_token,
      expires_in : body.expires_in,
      refresh_token : body.refresh_token,
      profile_picture_url : body.user.profile_picture_url,
      username : body.user.username,
      balance : body.balance
    }
    return toReturn

  }
  
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
      "client_id": 1967,
      'client_secret' : 'u5ZwJ2tXdWQZEWjjhfznj5erjZLjbbGp',
      'code' :  req.query.code
    }
    var url = 'https://api.venmo.com/v1/oauth/access_token';
    request.post({
      "url" :  url,
      "formData": data
    },
      function (err, response, body) {
        if (!error) {
          console.log('Got venmo credentials');
          console.log(body);
          var userID = req.query.state;
          models.User.findById(userID, function(findErr, user){
            if(findErr){
              console.log('findErr: ', findErr);
              return res.redirect('RoommatesApp://');
            }

            var venmoObj = makeUserVenmoFromBody(JSON.parse(body));
            console.log(venmoObj);
            user.venmo = venmoObj;
            user.save(function(saveErr, venmoUser){
              if(saveErr){
                console.log('save err: ', saveErr);
                return res.redirect('RoommatesApp://');
              }
              console.log("ADDED VENMO USER")
              console.log(venmoUser);
              return res.redirect('RoommatesApp://');
            })


          });



            // Save credentials
        }
        else {
          console.log(response.statusCode);
          console.log(err);
          res.redirect('RoommatesApp://');
        }
      });

    // Return to app
    // console.log("Throw redirect");
    // res.redirect('RoommatesApp://');

  });

}

