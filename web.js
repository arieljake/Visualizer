var _ = require("underscore");

var WebApp = require("./lib/node-lib/express/WebApp.js");
var lib = require("./lib");
var IDatabase = require("./lib/node-lib/interfaces/IDatabase.js");
var FantasyDB = require("./lib/node-lib/yahoo/FantasyDB.js");
var MongoKeyValueStore = require("./lib/node-lib/datasources/MongoKeyValueStore.js");

var mongoRepo = new MongoKeyValueStore(process.env.MONGO_URI || 'mongodb://localhost:27017/finances',"values");
var mongoDB = mongoRepo.mongoDB;
var simpleDB = mongoRepo.toIDatabase();
var cacheDB = mongoRepo.toIDatabase();
var userDB = new MongoKeyValueStore("mongodb://localhost:27017/finances?auto_reconnect=true","users");

var webPort = process.env.PORT || 3000; // public: 3003
var webHost = process.env.HOST || "localhost";
var viewLookup = {
	"mc": "matchupComparison"
}

var webApp = new WebApp();
webApp.init({
	webPort: webPort,
	webHost: webHost,
	socketPort: null,
	webDir: "/Users/arieljake/Documents/Projects/Visualizer",
	enableSessions: true,
	sessionConfig: {
		secret: "VISUalizr",
		dbName: "finances",
		dbTable: "sessions"
	},
	useOAuthPassport: true,
	oAuthPassportConfig: {
		strategyName: "yahoo",
		strategyOptions: {
			consumerKey: "dj0yJmk9S1gzNjE4UmpqTTZDJmQ9WVdrOWJHNXVhV3MzTnpZbWNHbzlNVGt6TmpFMk5UazJNZy0tJnM9Y29uc3VtZXJzZWNyZXQmeD1hZQ--",
			consumerSecret: "bcc80fdae468c8a800e9fdd1a011284b7d68ced6",
			callbackURL: webHost + ":" + webPort + '/auth/callback'
		},
		authUrl: "/auth",
		successRedirectUrl: "/",
		failureRedirectUrl: "/auth",
		logoutUrl: "/logout",
		logoutRedirectUrl: "/",
		userDB: userDB
	},
	configureApp: function (app)
	{
		app.get("/logs", webApp.ensureAuthenticated(), function(req,res)
		{
			mongoDB.collection("log").find().toArray(function(err,items)
			{
				res.send(items);
			})
		});

		app.get("/user/profile/yahoo", function(req,res)
		{
			if (req.user)
				res.send(req.user.profile);
			else
				res.send(null);
		})

		var simpleSaveRoute = (new lib.routes.SimpleSaveRoute(simpleDB,"/values")).attachToApp(app);
		var simpleViewRenderRoute = (new lib.routes.SimpleViewRenderRoute({baseUrl: "/v",viewLookup: viewLookup})).attachToApp(app);
		var simpleMovieRenderRoute = (new lib.routes.SimpleMovieRoutes({baseUrl: "/m",viewLookup: viewLookup})).attachToApp(app);
		var postBase64ImageRoute = (new lib.routes.PostBase64ImageRoute(__dirname + "/public/images/uploads/")).attachToApp(app);
		var cacheRoute = (new lib.routes.CacheRoute(simpleDB,"/cache")).attachToApp(app);
		var loggingRoute = (new lib.routes.LoggingRoute(mongoDB)).attachToApp(app);

		var categoryGroups = (new lib.routes.CategoryGroupsRoutes()).attachToApp(app);
		var fantasyRoutes = (new lib.routes.FantasyRoutes(new FantasyDB("http://localhost:" + webPort + "/data/yahoo"),cacheDB)).attachToApp(app);

	}
});
webApp.start();