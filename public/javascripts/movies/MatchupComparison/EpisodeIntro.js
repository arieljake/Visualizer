

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/logging",["Log.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,episodeNo)
		{
			this.movie = movie;
			this.episodeNo = episodeNo;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			self.vis = self.createVis()
				.attr("id","logo")
				.attr("opacity", 0);

			self.vis.append("text")
				.classed("express",1)
				.text("episode: " + self.episodeNo)
				.attr("transform",self.writeTranslate(300,300));

			self.vis.append("text")
				.text("Menlo Park OG's Keeper League")
				.attr("transform",self.writeTranslate(580,300));

			self.vis.append("text")
				.classed("description",1)
				.text("positional points breakdown")
				.attr("transform",self.writeTranslate(302,335));

			Log.log("Episode " + self.episodeNo + " displayed");

			self.vis.transition()
				.duration(1000)
				.attr("opacity",1)
				.each("end", self.transitionCB(function()
			{

				setTimeout(function()
				{
					self.vis.transition()
						.duration(1100)
						.attr("opacity",0)
						.each("end", self.transitionCB(function()
					{

						self.vis.remove();
						cb();
					}));

				},1500)

			}));
		}

	})(window, "EpisodeIntro");
});