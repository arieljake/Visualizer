
define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/MatchupComparison", ["WeekSelection.js","ClearMovieVis.js","MatchupSelection.js","OneMatchupAllPositions.js"])
	.toArray(), function ()
{
	(function (context, movieName)
	{
		var movie = context[movieName] = function (parentSelector)
		{
			var startupParams = {
				name: movieName,
				parentSelector: parentSelector,
				width: 1024,
				height: 768,
				constants: {
					positionOrder: ["QB","WR","WR1","WR2","RB","RB1","RB2","TE","W/R","K","DEF"]
				},
				curSceneInDev: "^WeekSelection" // null // "WeekSelection"
			};

			Movie.call(this,startupParams);
		};

		movie.prototype = new Movie();

		movie.prototype.getSceneFunctions = function()
		{
			var self = this;

			return [
				(new WeekSelection(self)).setPosition(25,50).setResultId("selectedWeek"),
				(new ClearMovieVis(self)),
				function()
				{
					return (new MatchupSelection(self,{weekNo: self.data.selectedWeek})).setPosition(25,50).setResultId("selectedMatchup");
				},
				(new ClearMovieVis(self)),
				function()
				{
					return (new OneMatchupAllPositions(self,self.data["selectedMatchup"])).setPosition(25,50);
				},
				function()
				{
					return (new MatchupSummary(self,self.data["selectedMatchup"])).setVisParent(self.vis).setPosition(25,50);
				}

//				(new Command(function(params,cb)
//				{
//					var matchupId = Math.min(Math.floor(Math.random() * 6) + 1,6);
//
//					$.get("/week/6/matchup/" + matchupId,function(data)
//					{
//						self.data.selectedMatchup = data;
//						cb();
//					});
//				})),
//				function()
//				{
//					return (new OneMatchupAllPositions(self,self.data["selectedMatchup"])).setPosition(100,50);
//				},
//				function()
//				{
//					return (new MatchupSummary(self,self.data["selectedMatchup"])).setVisParent(self.vis).setPosition(25,50);
//				}
			];
		};

		movie.prototype.play = function()
		{
			this.execute(null,function()
			{
				console.log("THE END");
			});
		}

	})(window, "MatchupComparison");
});