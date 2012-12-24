var express = require('express')
	, passport = require('passport')
	, util = require('util')
	, YahooStrategy = require('passport-yahoo-oauth').Strategy
	, MongoStore = require('connect-mongo')(express)
	, MongoKeyValueStore = require("./lib/node-lib/datasources/MongoKeyValueStore.js");

var userDB = new MongoKeyValueStore("mongodb://localhost:27017/finances?auto_reconnect=true","users");

var yahooStrategy = new YahooStrategy({
		consumerKey: "dj0yJmk9S1gzNjE4UmpqTTZDJmQ9WVdrOWJHNXVhV3MzTnpZbWNHbzlNVGt6TmpFMk5UazJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hZQ--",
		consumerSecret: "bcc80fdae468c8a800e9fdd1a011284b7d68ced6",
		callbackURL: 'http://localhost:3000/auth/yahoo/callback'
	},
	function(token, tokenSecret, profile, done) {
		profile._json.oauth = {
			token: token,
			tokenSecret: tokenSecret
		};

		return done(null, profile._json);
	}
);

passport.serializeUser(function(user, done)
{
	userDB.set(user.profile.uri,user,function(err,result)
	{
		done(null, user);
	});
});

passport.deserializeUser(function(user, done) {

	userDB.get(user.profile.uri,function(err,data)
	{
		done(null, data);
	});
});

passport.use(yahooStrategy);


var app = express();

// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'keyboard cat',
		store: new MongoStore({
			db: "finances",
			collection: "sessions",
			auto_reconnect: true
		})
	}));
	// Initialize Passport!  Also use passport.session() middleware, to support
	// persistent login sessions (recommended).
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(app.router);
	app.use(express.static(__dirname + '/../../public'));
});


app.get('/', function(req, res){
	res.render('oauth/index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
	res.render('oauth/account', { user: req.user });
});

app.get('/login', function(req, res){
	res.render('oauth/login', { user: req.user });
});

// GET /auth/yahoo
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Yahoo authentication will involve redirecting
//   the user to yahoo.com.  After authenticating, Yahoo will redirect the
//   user back to this application at /auth/yahoo/return
app.get('/auth/yahoo',
	passport.authenticate('yahoo', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

// GET /auth/yahoo/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/yahoo/callback',
	passport.authenticate('yahoo', { failureRedirect: '/login' }),
	function(req, res) {
		res.redirect('/');
	});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.get('/test', function(req, res)
{
	yahooStrategy.get("http://query.yahooapis.com/v1/yql?q=select * from fantasysports.leagues where league_key='nfl.l.623546'", function (err, body, response)
	{
		if (err) { return res.send(err); }

		try {
			res.send(body);
		} catch(e) {
			res.send(e);
		}
	});
});

app.get('/test/standings', function(req, res)
{
	var user = req.session.passport.user;
	var url = "http://query.yahooapis.com/v1/yql?q=select * from fantasysports.leagues.standings where league_key='nfl.l.623546'&format=json";
	var token = user.oauth.token;
	var tokenSecret = user.oauth.tokenSecret;

	yahooStrategy._oauth.get(url, token, tokenSecret, function (err, body, response)
	{
		if (err) { return res.send(err); }

		try {
			res.send(body);
		} catch(e) {
			res.send(e);
		}
	});
})

app.get('/test/rosterStats', function(req, res)
{
	var user = req.session.passport.user;
	var url = "http://query.yahooapis.com/v1/yql?q=select * from fantasysports.teams.roster.stats where team_key='nfl.l.623546.t.6' and week=7&format=json";
	var token = user.oauth.token;
	var tokenSecret = user.oauth.tokenSecret;

	yahooStrategy._oauth.get(url, token, tokenSecret, function (err, body, response)
	{
		if (err) { return res.send(err); }

		try {
			res.send(body);
		} catch(e) {
			res.send(e);
		}
	});
})

app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login')
}