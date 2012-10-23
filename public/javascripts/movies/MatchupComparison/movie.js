
define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/MatchupComparison", ["WeekSelection.js","ClearMovieVis.js","MatchupSelection.js","OneMatchupAllPositions.js"])
	.toArray(), function ()
{
	(function (context, movieName)
	{
		var movie = context[movieName] = function (parentSelector)
		{
			var self = this;

			self.parent = d3.select(parentSelector);
			self.w = 2000;
			self.h = 2000;
			self.constants = {
				positionOrder: ["QB","WR","WR1","WR2","RB","RB1","RB2","TE","W/R","K","DEF"]
			};
			self.scenes = [
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
			self.curSceneInDev = "^WeekSelection";// null; //
		};

		movie.prototype = new Movie(movieName);

	})(window, "MatchupComparison");
});