var LocalStrategy   = require('passport-local').Strategy;

var models            = require('../app/models/index.js');

var User = models.User;

module.exports = function(passport){


  console.log("inside of passport, about to do its magic")
  passport.serializeUser(function(user, done){
    console.log("serializeUser")
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
  
  passport.use('local-register', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done){
      console.log("inside of local-register")
      process.nextTick(function(){
        User.findOne({'username' : username}, function(err, user){
          if(err){
            return done(err);
          }
          if(user){
            return done(null, false);
          }
          else{
            var newUser = new User();
            newUser.username = username;
            newUser.password = newUser.generateHash(password);

            newUser.save(function(err){
              if(err){
                throw err;
              }
              return done(null, newUser);
            });
          }
        });
      });
    })
  );


  passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
      },
      function(req, username, password, done){
        console.log("about to search")
        User.findOne({'username' : username}, function(err, user){
          if(err){
            console.log(err)
            return done(err);
          }
          if(!user){
            console.log("no user")
            return done(null, false)
          }
          if(!user.validPassword(password)){
            return done(null, false)
          }
          return done(null, user);
        })
      }
    )
  );

}
