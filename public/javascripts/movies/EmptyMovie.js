
var _scenes = [""];

define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/EmptyMovie", _.map(_scenes,function(filename) { return filename + ".js";}))
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

	})(window, "EmptyMovie", _scenes);
});