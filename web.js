var WebApp = require("./lib/node-lib/express/WebApp.js");
var WebAppDelegate = require("./lib/node-lib/express/WebAppDelegate.js");
var lib = require("./lib");
var IDatabase = require("./lib/node-lib/interfaces/IDatabase.js");
var FantasyDB = require("./lib/node-lib/yahoo/FantasyDB.js");
var MongoKeyValueStore = require("./lib/node-lib/datasources/MongoKeyValueStore.js");

var mongoRepo = new MongoKeyValueStore(process.env.MONGO_URI || 'mongodb://localhost:27017/finances',"values");
var mongoDB = mongoRepo.mongoDB;
var simpleDB = mongoRepo.toIDatabase();
var cacheDB = mongoRepo.toIDatabase();

var webPort = process.env.PORT || 3000; // public: 3003
var viewLookup = {
	"mc": "matchupComparison"
}

new WebApp(new WebAppDelegate(
	{
		webPort: webPort,
		socketPort: null,
		webDir: "/Users/arieljake/Documents/Projects/Visualizer",
		enableSessions: true
	},
	{
		configureRoutes: function (server)
		{
			server.get("/logs", function(req,res)
			{
				mongoDB.collection("log").find().toArray(function(err,items)
				{
					res.send(items);
				})
			});

			server.get("/m/:movieId", function(req,res)
			{
				var movieId = req.params["movieId"];
				var movieFilename = "movie";

				if (req.query["episode"])
				{
					movieFilename += ".episode-" + req.query["episode"];
				}

				movieFilename += ".js";

				if (movieId.length <= 2)
				{
					movieId = viewLookup[movieId] || movieId;
				}

				var params = {
					movieId: movieId,
					movieFilename: movieFilename
				}

				res.render("simpleMovieView",{title: "",params: params});
			})

			var simpleSaveRoute = (new lib.routes.SimpleSaveRoute(simpleDB,"/values")).attachToApp(server);
			var simpleViewRenderRoute = (new lib.routes.SimpleViewRenderRoute({baseUrl: "/v",viewLookup: viewLookup})).attachToApp(server);
			var postBase64ImageRoute = (new lib.routes.PostBase64ImageRoute(__dirname + "/public/images/uploads/")).attachToApp(server);
			var cacheRoute = (new lib.routes.CacheRoute(simpleDB,"/cache")).attachToApp(server);
			var loggingRoute = (new lib.routes.LoggingRoute(mongoDB)).attachToApp(server);

			var categoryGroups = (new lib.routes.CategoryGroupsRoutes()).attachToApp(server);
			var fantasyRoutes = (new lib.routes.FantasyRoutes(new FantasyDB("http://localhost:" + webPort + "/data/yahoo"),cacheDB)).attachToApp(server);

		}
	}
)).init().start();