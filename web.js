var WebAppFactory = require("./lib/node-lib/express/WebAppFactory.js");
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

WebAppFactory.createWebApp(new WebAppDelegate(
	{
		webPort: 3000, // 3003 for public
		socketPort: null,
		webDir: "/Users/arieljake/Documents/Projects/Visualizer"
	},
	{
		configureRoutes: function ()
		{
			var simpleSaveRoute = (new lib.routes.SimpleSaveRoute(simpleDB,"/values")).attachToApp(this.expressApp);
			var simpleViewRenderRoute = (new lib.routes.SimpleViewRenderRoute({})).attachToApp(this.expressApp);
			var postBase64ImageRoute = (new lib.routes.PostBase64ImageRoute(__dirname + "/public/images/uploads/")).attachToApp(this.expressApp);
			var cacheRoute = (new lib.routes.CacheRoute(simpleDB,"/cache")).attachToApp(this.expressApp);

			var categoryGroups = (new lib.routes.CategoryGroupsRoutes()).attachToApp(this.expressApp);
			var fantasyRoutes = (new lib.routes.FantasyRoutes(new FantasyDB(mongoDB),cacheDB)).attachToApp(this.expressApp);
		}
	}
),true,function(webApp)
{

});