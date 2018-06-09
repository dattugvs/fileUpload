var express 	= require('express');
var app 		= express();
var passport    = require('passport');
var bodyParser 	= require('body-parser');
var mongoose   	= require('mongoose');
var morgan		= require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

mongoose.connect('mongodb://dattugvs:dattu123@ds161939.mlab.com:61939/dropio');

mongoose.connection.on('connected', function (err) {
  console.log("Connected to database.");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.set('view engine', 'ejs');

app.use(session({ 
	secret: 'dattu123',
    resave: true, 
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes')(app, passport);	// routes for file upload, triggering local strategy
require('./passport')(app, passport);	// authentication purpose


console.log(3000);
app.listen(3000);