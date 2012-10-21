

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie)
		{
			this.movie = movie;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			this.movie.vis.selectAll("g").remove();

			cb();
		}

	})(window, "ClearMovieVis");
});