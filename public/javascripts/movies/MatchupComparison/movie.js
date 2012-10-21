
define(RequireImports.new()
	.add("/javascripts/movies", ["Movie.js"])
	.add("/javascripts/movies/MatchupComparison", ["QBComparisons.js"])
	.toArray(), function ()
{
	(function (context, movieName, sceneNames)
	{
		var movie = context[movieName] = function (parentSelector)
		{
			this.type = movieName;
			this.parent = d3.selectAll(parentSelector);
			this.w = 2000;
			this.h = 2000;
			this.scenes = [
				(new QBComparisons(this,{weekNo: 6})).setPosition(100,50)
			];
			this.constants = {

			};
			this.curSceneInDev = null;
		};

		movie.prototype = new Movie();

	})(window, "MatchupComparison");
});