
var _scenes = ["Intro","Averages"];

define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/AverageMovie", _.map(_scenes,function(filename) { return filename + ".js";}))
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
				teamRed: "#883300",
				h1Fill: "#830",
				h2Fill: "black",
				h3Fill: "#999"
			};
			this.curSceneInDev = "AveragesPrep";
		};

		movie.prototype = new Movie();

	})(window, "AverageMovie", _scenes);
});