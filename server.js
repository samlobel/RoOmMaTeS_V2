var express = require('express');
var app = express()
var mongoose = require('mongoose');
var passport = require('passport');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');

var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');






mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration


app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms

app.set('view engine', 'jade');

app.use(session({ secret: 'RoomMatesFourLife' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



// app.use(function(req,res,next){console.log(req); res.set("Connection", "close"); res.set("Content-Type", "application/json"); next()}); //solves some bug about keep-alive in ios. necessary evil
app.use(function(req,res,next){res.set("Connection", "close"); next()});
//maybe this isn't the best place for it though, who knows.
  

require('./app/preAuthRoutes.js')(app, passport); //these are things that don't need authentication.

app.use(require('./app/AuthMiddleware.js')) //I think this is right, it may not be able to get past it.
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// WEBSOCKETS CODE
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


require('./app/socket.js')(io);
require('./config/http.js')(server);



var port = process.env.PORT || 8080
server.listen(port);
console.log('The magic happens on port ' + port);
