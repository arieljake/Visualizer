

define(RequireImports.new()
	.add("/js-lib/js/control",["DelayCommand.js"])
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/MatchupComparison",["PosBoxScore.js","PosScoringCircles.js"])
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

			self.posGroups.selectAll("rect")
				.transition()
				.duration(self.getDuration(500))
				.attr("fill", "#EFEFEF")
				.each("end",Transitions.cb(function()
			{
				self.vis.attr("class","")
					.classed(varName,1);

				self.posGroups.attr("class","")
					.classed("posSummary",1);

				var commands = [];
				commands.push(new PosBoxScore(self.movie,self.posGroups,self.matchup).setVisParent(self.vis).setPosition(0,0).setResultId("posBoxScore"));
				commands.push(new PosScoringCircles(self.movie).setVisParent(self.vis).setPosition(0,150));

				self.run(commands,cb);
			}));
		}

	})(window, "MatchupSummary");
});