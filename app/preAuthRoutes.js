var models = require('./models/index.js');
var _ = require('underscore');


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
  var data;
  
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

    // Send Auth data back to venmo
    data = {
      'client_id' : '2583',
      'client_secret' : 'PcY324UY8Fdhs3RCsUR5c4Nthd2Hy6Mx',
      'code' :  req.query.code
    }
    var url = 'https://api.venmo.com/v1/oauth/access_token';

    console.log("Throw redirect");
    res.redirect('/catch-venmo');

  });


  app.get('/catch-venmo', function (req, res) {
    console.log('Caught redirect');

    // Post auth data to venmo
    var request = require('request');
    console.log(request);
    request.post(
      'https://api.venmo.com/v1/oauth/access_token',
      data,
      function (err, res, body) {
        if (!error && response.statusCode == 200) {
            console.log('Got venmo credentials');
            console.log(body);

            // Save credentials
        }
      });

    // Return to app
    res.redirect('RoommatesApp://');
  });

}

