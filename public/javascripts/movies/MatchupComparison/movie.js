
var _scenes = ["QBComparisons"];

define(RequireImports.new()
	.add("/javascripts/movies", ["Movie.js"])
	.add("/javascripts/movies/MatchupComparison", _.map(_scenes,function(filename) { return filename + ".js";}))
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
			this.sceneNames = sceneNames;
			this.constants = {

			};
			this.curSceneInDev = null;
		};

		movie.prototype = new Movie();

	})(window, "MatchupComparison", _scenes);
});