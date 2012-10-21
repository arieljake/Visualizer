

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/AverageMovie",["AveragesPrep.js"])
	.toArray(),function()
{
	(function (context, sceneName)
	{
		var scene = context[sceneName] = function (movie)
		{
			this.name = sceneName;
			this.movie = movie;
		};

		scene.prototype = new MovieClip();

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			setTimeout(function()
			{
				self.step1(cb);
			},self.getDuration(2000));
		};

		scene.prototype.step1 = function(cb)
		{
			var self = this;
			var movie = self.movie;

			var textGroup = movie.vis.selectAll(".textGroup");
			textGroup.selectAll("text").remove();

			var averagesPrep = new AveragesPrep(movie);
			averagesPrep.execute(null,function()
			{
				var teamPos = movie.getPositionFn(".team","x");

				cb();
			})
		}

	})(window, "Averages");
});