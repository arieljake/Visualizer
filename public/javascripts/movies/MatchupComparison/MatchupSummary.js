

define(RequireImports.new()
	.add("/js-lib/js/control",["DelayCommand.js"])
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/MatchupComparison",["PosBoxScore.js","PosScoringCircles.js","PressSpacebarToContinue.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,matchup)
		{
			this.movie = movie;
			this.matchup = matchup;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			self.vis = d3.select("g.PositionsAgenda");
			self.posGroups = self.vis.selectAll("g.positionAgendaItem");

			$("g.OneMatchupAllPositions text.title").remove();

			self.posGroups.selectAll("rect")
				.transition()
				.duration(self.getDuration(500))
				.attr("fill", "#EFEFEF")
				.each("end",self.transitionCB(function()
			{
				self.vis.attr("class","")
					.classed(varName,1);

				self.posGroups.attr("class","")
					.classed("posSummary",1);

				var commands = [];
				commands.push(new PosBoxScore(self.movie,self.posGroups,self.matchup).setVisParent(self.vis).setPosition(0,10).setResultId("posBoxScore"));
				commands.push(function()
				{
					var winnerLines = $("text.winnerLine");
					var circlesY = (winnerLines.length > 0) ? 230 : 150;

					return new PosScoringCircles(self.movie).setVisParent(self.vis).setPosition(0,circlesY)
				});
				commands.push(new PressSpacebarToContinue(self.movie));

				self.run(commands,cb);
			}));
		}

	})(window, "MatchupSummary");
});