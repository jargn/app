// # app
/**
 * Launching point for the Express app.
 */

// Set the port on which to run the app
var APP_PORT = 3000;

// Module dependencies and routes
var express = require('express')
, routes = require('./routes')
, path = require('path')
, flash = require('connect-flash')

, index = require('./routes/index')
, connect = require('./routes/connect')
, discover = require('./routes/discover')
, findfriends = require('./routes/findfriends')
, help = require('./routes/help')
, login = require('./routes/login')
, search = require('./routes/search')
, settings = require('./routes/settings')
, signup = require('./routes/signup')
, user = require('./routes/user')
;

// ## app object
// The Express app
var app = express();

// ## server object
// The HTTP server built on the app
var server = require('http').createServer(app);

// ## io object
// socket.io attached to the HTTP server object
var io = require('socket.io', {'log level': 0}).listen(server);

// Make the app listen
server.listen(APP_PORT);

// ### *function*: authmw
/**
 * Middleware for authentication and redirecting.
 *
 * @param {object} req The HTTP request
 * @param {object} res The HTTP response
 * @param {function} next The next route, as defined by the router
 */
function authmw (req, res, next) {
	//Pattern defining login or signup URLs
	var signupOrLoginURL = /^\/(login|signup)/;
	
	//Pattern defining stylesheet or static javascript URLs
	var staticURL = /^\/(stylesheets|javascripts)/;
	
	//If the user is not logged in
	if (req.session.user === undefined){
		//If a logged out user is trying to log in or sign up
		if (req.url.match(signupOrLoginURL) || req.url.match(staticURL)) {
			//Then continue to next route
			next();
		}
		//Otherwise, redirect to login
		else {
			login.display(req, res, next);
		}
	}
	//Otherwise, the user is logged in
	else {
		//If a logged in user is trying to log in or sign up
		if (req.url.match(signupOrLoginURL)) {
			//Then redirect to index
			routes.index(req, res, next);
		}
		//Otherwise, continue to next route
		else {
			next();
		}
	}
}

//Configure Express and use middleware
app.configure(function(){
	//Set the correct port to run on
	app.set('port', process.env.PORT || APP_PORT);

	//Set the view directory path
	app.set('views', __dirname + '/views');

	//Set the default engine extension to use when omitted
	app.set('view engine', 'ejs');

	//Parser for the body of HTTP requests
	app.use(express.bodyParser());

	//Allows use of DELETE and PUT
	app.use(express.methodOverride());

	//Populates req.cookies with an object keyed by the cookie names
	app.use(express.cookieParser('kittens'));

	//Use session middleware (must be used after express.cookieParser)
	app.use(express.session());

	//Use flash support for sessions
	app.use(flash());

	//Use the custom authentication middleware for redirecting
	app.use(authmw);

	//Use router middleware (must be used after express.session)
	app.use(app.router);

	//Serve up static files in the 'public' directory
	app.use(express.static(path.join(__dirname, '/public')));
});

// Configure Express in development mode
app.configure('development', function(){
	app.use(express.errorHandler());
	app.use(express.logger('dev'));
});

// Define the routes
app.get('/', index.display);
app.get('/connect', connect.display);
app.get('/discover', discover.display);
app.get('/findfriends', findfriends.display);
app.get('/help', help.display);
app.get('/search', search.display);
app.get('/settings', settings.display);

app.get('/login', login.display);
app.post('/login/auth', login.auth);
app.get('/logout', login.logout);

app.get('/signup', signup.display);
app.post('/signup/auth', signup.auth);

app.get('/user/:username', user.display);
app.post('/user/:username/follow', user.followAction);
app.post('/check', user.check);

// Allow posts to be sent back and forth between client and server
io.sockets.on('connection', function (socket) {
	index.initPost(socket);
});