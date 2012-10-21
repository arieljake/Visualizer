

define(RequireImports.new()
	.add("/javascripts/movies/",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Teams.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie)
		{
			this.movie = movie;
		};

		scene.prototype = new MovieClip("EmptyMovieClip");

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Teams.get(null,function(err,teams)
			{
				self.data = teams;
				self.vis = self.createVis();
				self.once("end", cb);
			});
		}

	})(window, "EmptyMovieClip");
});