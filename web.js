var WebApp = require("./lib/node-lib/express/WebApp.js");
var WebAppDelegate = require("./lib/node-lib/express/WebAppDelegate.js");
var lib = require("./lib");
var IDatabase = require("./lib/node-lib/interfaces/IDatabase.js");
var FantasyDB = require("./lib/node-lib/yahoo/FantasyDB.js");
var SimpleDBService = require("./lib/node-lib/datasources/SimpleDBService.js");

var mongoskin = require("mongoskin");
var mongoURL = process.env.MONGO_URI || 'mongodb://localhost:27017/finances';
var mongoDB = mongoskin.db(mongoURL);

var simpleDB = new IDatabase(new SimpleDBService(mongoDB,"values"));
var cacheDB = simpleDB;

var webPort = 3000; // public: 3003

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
			var simpleSaveRoute = (new lib.routes.SimpleSaveRoute(simpleDB,"/values")).attachToApp(server);
			var simpleViewRenderRoute = (new lib.routes.SimpleViewRenderRoute({})).attachToApp(server);
			var postBase64ImageRoute = (new lib.routes.PostBase64ImageRoute(__dirname + "/public/images/uploads/")).attachToApp(server);
			var cacheRoute = (new lib.routes.CacheRoute(simpleDB,"/cache")).attachToApp(server);

			var categoryGroups = (new lib.routes.CategoryGroupsRoutes()).attachToApp(server);
			var fantasyRoutes = (new lib.routes.FantasyRoutes(new FantasyDB("http://localhost:" + webPort + "/data/yahoo"),cacheDB)).attachToApp(server);

			server.post("/logging", function(req,res)
			{
				mongoDB.collection("log").insert({
					visualizerId: req.session.visualizerId,
					timestamp: (new Date()).getTime(),
					entry: req.body
				});

				res.send("1");
			});
		}
	}
)).init().start();