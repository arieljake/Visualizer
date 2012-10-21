

define(RequireImports.new()
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/MatchupComparison",["PosComparison.js","PositionsAgenda.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie,matchup)
		{
			this.movie = movie;
			this.matchup = new Matchup(matchup);
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			self.vis = self.createVis();

			self.data = self.matchup;
			self.agenda = (new PositionsAgenda(self.movie,self.matchupParams)).setVisParent(self.vis).setPosition(0,0);

			var commands = [];
			commands.push(self.agenda);

			self.agenda.getPositions().forEach(function(matchup)
			{
				commands.push(new Command(self.agenda.setActiveMatchup,matchup,self.agenda));

				var posComparison = new PosComparison(self.movie,"QB",);
				posComparison.setVisParent(self.vis);
				posComparison.setPosition(0,120);

				commands.push(posComparison);
				commands.push(posComparison.getRemoveCommand());
			});

			var sequence = new CommandSequence(commands);
			sequence.execute(null,cb);
		}

	})(window, "2TeamComparison");
});