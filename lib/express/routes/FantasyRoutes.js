
var CacheRoute = require("../../node-lib/express/routes/CacheRoute.js");

var FantasyRoutes = module.exports = function(fantasyDB,cacheDB)
{
	this.fantasyDB = fantasyDB;
	this.cacheDB = cacheDB;
};

FantasyRoutes.prototype.attachToApp = function(app)
{
	var self = this;
	var cacheRoute = new CacheRoute(this.cacheDB);

	app.get("/weekList", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getWeekList(null,function(err,value)
		{
			res._responseData = {
				key: "weekList",
				value: value
			};

			next();
		})
	});

	app.get("/matchupList", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getMatchups(null,function(err,value)
		{
			res._responseData = {
				key: "matchupList",
				value: value
			};

			next();
		});
	});

	app.get("/teams", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getTeams(null,function(err,value)
		{
			res._responseData = {
				key: "teams",
				value: value
			};

			next();
		})
	});

	app.get("/matchups", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getMatchups(null,function(err,value)
		{
			res._responseData = {
				key: "matchups",
				value: value
			};

			next();
		})
	});

	app.get("/standings", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getStandings({weekNo: 5},function(err,value)
		{console.dir(value);
			res._responseData = {
				key: "standings",
				value: value
			};

			next();
		})
	});

	app.get("/week/:weekNo/standings", cacheRoute.getRoute(), function(req,res,next)
	{
		var params = {
			weekNo: req.params["weekNo"]
		};

		self.fantasyDB.getStandings(params,function(err,standings)
		{
			res._responseData = standings;

			next();
		});
	});

	app.get("/week/:weekNo/matchup/:matchupId", cacheRoute.getRoute(), function(req,res,next)
	{
		var params = {
			weekNo: req.params["weekNo"],
			matchupId: req.params["matchupId"]
		};

		self.fantasyDB.getMatchup(params,function(err,matchup)
		{
			res._responseData = matchup;

			next();
		});
	});

	app.get("/team/:teamId/matchups", cacheRoute.getRoute(), function(req,res,next)
	{
		var params = {
			teamId: req.params["teamId"]
		};

		self.fantasyDB.getMatchups(params,function(err,matchups)
		{
			res._responseData = matchups;

			next();
		});
	});

	app.get("/team/:teamId/performances", cacheRoute.getRoute(), function(req,res,next)
	{
		var params = {
			teamId: req.params["teamId"]
		};

		self.fantasyDB.getPerformances(params,function(err,performances)
		{
			res._responseData = performances;

			next();
		});
	});

	app.get("/team/:teamId/players", cacheRoute.getRoute(), function(req,res,next)
	{
		var params = {
			teamId: req.params["teamId"]
		};

		self.fantasyDB.getPlayers(params,function(err,players)
		{
			res._responseData = players;

			next();
		});
	});

//	(new DataChainRouter("/d/",[
//		{
//			path: "teamMatchups",
//			route: self.fantasyDB.getTeamMatchup
//		}
//	]));
};