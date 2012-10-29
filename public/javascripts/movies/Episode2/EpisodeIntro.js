

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

			self.logoGroup = self.vis.append("g")
				.classed("logoGroup",1)
				.attr("id","logo")
				.style("filter","url(#logo_blur)")
				.attr("opacity",0)
				.attr("transform",self.writeTranslate(300,300));

			self.logoGroup.append("text")
				.classed("express",1)
				.text("episode: " + self.episodeNo);

			self.logoGroup.append("text")
				.classed("description",1)
				.text("team transaction analysis")
				.attr("transform",self.writeTranslate(2,35));

			self.logoGroup.transition()
				.duration(self.getDuration(2000))
				.attr("opacity",1)
				.each("end", self.transitionCB(function()
			{

			}));

			self.logoBlur.transition()
				.duration(self.getDuration(2000))
				.attr("stdDeviation",0)
				.each("end", self.transitionCB(function()
			{
				self.callIn("moveLogoUp",0,cb);
			}));
		}

		scene.prototype.moveLogoUp = function(params,cb)
		{
			var self = this;

			self.logoGroup.transition()
				.duration(self.getDuration(1500))
				.attr("transform",self.writeTranslate(300,100));

			setTimeout(function()
			{
				var background = (new Background(self.movie));
				background.execute(null,function()
				{
					self.logoGroup.transition()
						.duration(self.getDuration(1000))
						.attr("opacity",0)
						.each("end", self.transitionCB(cb));
				});

			},self.getDuration(1000));
		}

	})(window, "EpisodeIntro");
});