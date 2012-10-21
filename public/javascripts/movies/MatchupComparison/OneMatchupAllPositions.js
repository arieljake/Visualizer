

define(RequireImports.new()
	.add("/js-lib/js/control",["Command.js"])
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/MatchupComparison",["PosComparison.js","PositionsAgenda.js"])
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
			self.vis = self.createVis();

			self.agenda = (new PositionsAgenda(self.movie,self.matchup)).setVisParent(self.vis).setPosition(0,0);
			self.agenda.execute(null,function()
			{
				var commands = [];

				self.agenda.getPositions().forEach(function(position)
				{
					commands.push(new Command(self.agenda.setActivePosition,position,self.agenda));

					var posComparison = new PosComparison(self.movie,position,self.matchup);
					posComparison.setVisParent(self.vis);
					posComparison.setPosition(0,120);

					commands.push(posComparison);
					commands.push(posComparison.getRemoveCommand());
				});

				var sequence = new CommandSequence(commands);
				sequence.execute(null,cb);
			});
		}

	})(window, "OneMatchupAllPositions");
});