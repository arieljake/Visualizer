

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,pos,comparison,matchup,target)
		{
			this.movie = movie;
			this.pos = pos;
			this.comparison = comparison;
			this.matchup = new Matchup(matchup);
			this.target = target;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			var team1PosPlayers = self.matchup.getTeam1().getActivePlayers().toPlayerCollection().filter(function(player)
			{
				return player.getSlot() == self.pos;
			});
			var team2PosPlayers = self.matchup.getTeam2().getActivePlayers().toPlayerCollection().filter(function(player)
			{
				return player.getSlot() == self.pos;
			});

			self.target.append("text")
				.text(team1PosPlayers.getPointsScored())
				.attr("x",5)
				.attr("y",35);

			self.target.append("text")
				.text(team2PosPlayers.getPointsScored())
				.attr("x",5)
				.attr("y",50);

			if (self.comparison.actual.diff > 3)
			{
				self.target.classed("winner",1);

				self.target.select("rect")
					.attr("fill",self.movie.constants.yellowHi);

				self.target.append("image")
					.attr("xlink:href","/images/teams/" + this.comparison.actual.winner.id + ".png")
					.attr("width",25)
					.attr("height",25)
					.attr("y",57);
			}

			cb();
		};

	})(window, "PosBoxScoreInning");
});