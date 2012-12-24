
var _ = require("underscore");
var _str = require("underscore.string");
var fs = require("fs");

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

	app.get("/man/fantasyRoutes", function(req,res)
	{
		fs.readFile(__filename,function(err,data)
		{
			var contents = data.toString("utf8");
			var httpVerbs = ["get","post"];
			var numChars = _.max(_.map(httpVerbs,function(verb) { return verb.length; }));
			var routeDefs = _.filter(contents.split("app."), function(str)
			{
				var start = str.substr(0,numChars);

				return _.any(httpVerbs, function(verb)
				{
					return start.indexOf(verb) == 0;
				});
			});
			var routes = _.map(routeDefs, function(def)
			{
				var paren1Loc = def.indexOf("(");
				var paramsLookup = (new RegExp(/var params\s+\=\s+\{([^\}]*)\}\;/)).exec(def);
				var params = paramsLookup ? _.object(_.map(paramsLookup[1].trim().split(","), function(pair)
				{
					return _.map(pair.split(":"),function(part)
					{
						return part.trim();
					});
				})) : null;

				var firstFnStart = paramsLookup ? def.indexOf("var params") + paramsLookup[0].length-1 : def.indexOf("{");
				var firstFnCall = (new RegExp(/((\.*\w+)+)/)).exec(def.substr(firstFnStart));

				return {
					def: def,
					verb: def.substr(0,paren1Loc),
					path: def.substring(paren1Loc+1,def.indexOf(",")).replace(/\"/g,""),
					isCached: def.indexOf("cacheRoute.getRoute()") > 0,
					firstFnCall: firstFnCall ? firstFnCall[1] : null,
					params: params
				}
			})

			res.render("routeDocs",{title: "Fantasy Routes", routes: routes});
		});
	});

	app.get("/weekList", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getWeekList(null,function(err,value)
		{
			res._responseData = value;

			next();
		})
	});

	app.get("/matchupList", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getMatchups(null,function(err,value)
		{
			res._responseData = value;

			next();
		});
	});

	app.get("/teams", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getTeams(null,function(err,value)
		{
			res._responseData = value;

			next();
		})
	});

	app.get("/matchups", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getMatchups(null,function(err,value)
		{
			res._responseData = value;

			next();
		})
	});

	app.get("/standings", cacheRoute.getRoute(), function(req,res,next)
	{
		self.fantasyDB.getStandings({weekNo: 5},function(err,value)
		{
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

	app.get("/week/:weekNo/matchups", cacheRoute.getRoute(), function(req,res,next)
	{
		var params = {
			weekNo: req.params["weekNo"],
			matchupId: null
		};

		self.fantasyDB.getMatchupList(null,function(err,matchupList)
		{
			var matchups = [];

			matchupList.forEach(function(matchupId)
			{
				params.matchupId = matchupId;

				self.fantasyDB.getMatchup(params,function(err,matchup)
				{
					matchups.push(matchup);

					if (matchups.length == matchupList.length)
					{
						res._responseData = matchups;
						next();
					}
				});
			})
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