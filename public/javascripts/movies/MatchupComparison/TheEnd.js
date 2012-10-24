

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/logging",["Log.js"])
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

			self.vis = self.createVis()
				.attr("id","logo");

			self.vis.append("text")
				.classed("express",1)
				.text("the end")
				.attr("transform",self.writeTranslate(300,300));

			self.vis.append("text")
				.text("episode: 1")
				.attr("transform",self.writeTranslate(505,300));

			self.vis.append("text")
				.classed("description",1)
				.text("send feedback to: arieljake@yahoo.com")
				.attr("transform",self.writeTranslate(302,330));

			Log.log("TheEnd displayed");

			cb();
		}

	})(window, "TheEnd");
});