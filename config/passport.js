var LocalStrategy   = require('passport-local').Strategy;

var models            = require('../app/models/index.js');

var User = models.User;

module.exports = function(passport){

  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
  
  passport.use('local-signup', new LocalStrategy({
      usernameField : 'username',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done){
      process.nextTick(function(){
        User.findOne({'local.username' : username}, function(err, user){
          if(err){
            return done(err);
          }
          if(user){
            return done(null, false);
          }
          else{
            var newUser = new User();
            newUser.local.username = username;
            newUser.local.password = newUser.generateHash(password);

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
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
      },
      function(req, email, password, done){
        User.findOne({'local.email' : email}, function(err, user){
          if(err){
            return done(err);
          }
          if(!user){
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
