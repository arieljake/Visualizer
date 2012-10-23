

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

			var introGroup = self.vis.append("g")
				.classed("intro",1);

			introGroup.append("rect")
				.attr("width",self.movie.width)
				.attr("height",self.movie.height)
				.attr("fill","#000");

			introGroup.append("image")
				.attr("xlink:href","/images/icons/nfl_2012_masthead.jpg")
				.attr("width",939)
				.attr("height",211)
				.attr("transform",self.writeTranslate(0,0))
				.attr("opacity",0)
				.transition()
				.duration(self.getDuration(3000))
				.attr("opacity",1)
				.each("end",self.transitionCB(function()
			{
				introGroup.append("text")
					.text("Menlo Park OG's Keeper League")
					.attr("font-size","20pt")
					.attr("fill","#cecece")
					.attr("font-family","Helvetica")
					.attr("transform",self.writeTranslate(100,250))
					.each("end",self.transitionCB(function()
				{

					var weekSelection = (new WeekSelection(self.movie)).setVisParent(self.vis).setPosition(25,50).setResultId("selectedWeek");
					weekSelection.execute(null,function()
					{
						var matchupSelection = (new MatchupSelection(self.movie,{weekNo: self.movie.data.selectedWeek})).setVisParent(self.vis).setPosition(25,50).setResultId("selectedMatchup");
						matchupSelection.execute(null, function()
						{
							cb();
						})
					});
				}));
			}));


		}

	})(window, "Intro");
});