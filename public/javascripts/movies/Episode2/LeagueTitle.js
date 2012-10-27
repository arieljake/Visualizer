

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			self.vis = self.createVis();

			self.vis.append("text")
				.text("Menlo Park OG's Keeper League")
				.attr("transform",self.writeTranslate(10,self.movie.height - 10))
				.attr("fill","#B56585");

			cb();
		}

	})(window, "LeagueTitle");
});