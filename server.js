var express = require('express');
var app = express()
var port = process.env.PORT || 3000
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
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'jade');

app.use(session({ secret: 'RoomMatesFourLife' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
console.log('The magic happens on port ' + port);


