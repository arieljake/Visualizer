
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

			self.parent = d3.selectAll(parentSelector);
			self.w = 2000;
			self.h = 2000;
			self.scenes = [
				(new WeekSelection(self)).setPosition(100,50).setResultId("selectedWeek"),
				(new ClearMovieVis(self)),
				function()
				{
					return (new MatchupSelection(self,{weekNo: self.data.selectedWeek})).setPosition(100,50).setResultId("selectedMatchup");
				},
				(new ClearMovieVis(self)),
				function()
				{
					return (new OneMatchupAllPositions(self,self.data.selectedMatchup)).setPosition(100,50);
				}
			];
			self.curSceneInDev = null;
		};

		movie.prototype = new Movie(movieName);

	})(window, "MatchupComparison");
});