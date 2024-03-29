

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/Episode2",["Background.js"])
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

			self.vis = self.createVis();

			self.logoBlur = self.movie.vis.append("filter")
				.attr("id","logo_blur")
				.append("feGaussianBlur")
				.attr("stdDeviation",2.0);

			self.introGroup = self.vis.append("g")
				.classed("logoGroup",1)
				.attr("id","logo")
				.attr("opacity",1)
				.style("filter","url(#logo_blur)")
				.attr("transform",self.writeTranslate(300,300));

			var h1 = self.introGroup.append("text")
				.classed("express",1)
				.attr("opacity",0)
				.text("episode: " + self.episodeNo);

			var h2 = self.introGroup.append("text")
				.classed("description",1)
				.attr("opacity",0)
				.text("positional strength analysis")
				.attr("transform",self.writeTranslate(2,35));

			self.logoBlur.transition()
				.duration(self.getDuration(2000))
				.attr("stdDeviation",0)
				.each("end", self.transitionCB(function()
			{

			}));

			h1.transition()
				.duration(self.getDuration(2000))
				.attr("opacity",1);

			h2.transition()
				.delay(1300)
				.duration(self.getDuration(1700))
				.attr("opacity",1)
				.each("end", self.transitionCB(function()
			{
				self.introGroup.transition()
					.delay(500)
					.duration(self.getDuration(1000))
					.attr("opacity",0)
					.each("end", self.transitionCB(cb));
			}));
		}

	})(window, "EpisodeIntro");
});