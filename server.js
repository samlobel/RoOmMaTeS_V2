var express = require('express');
var app = express()
var port = process.env.PORT || 8080
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


require('./app/preAuthRoutes.js')(app, passport); //these are things that don't need authentication.

app.use(require('./app/AuthMiddleware.js')) //I think this is right, it may not be able to get past it.
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// WEBSOCKETS CODE
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('./config/socket.js')(io);


server.listen(port);
console.log('The magic happens on port ' + port);