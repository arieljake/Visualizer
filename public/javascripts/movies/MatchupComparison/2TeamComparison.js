

define(RequireImports.new()
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Matchups.js"])
	.add("/javascripts/movies/",["MovieClip.js"])
	.add("/javascripts/movies/MatchupComparison",["PosComparison.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie)
		{
			this.movie = movie;
		};

		scene.prototype = new MovieClip();

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			self.vis = self.createVis();

			Matchups.get(self.matchupParams,function(err,matchups)
			{
				self.data = matchups;
				self.agenda = (new MatchupsAgenda(self.movie,self.matchupParams)).setVisParent(self.vis).setPosition(0,0);

				var commands = [];
				commands.push(self.agenda);

				matchups.forEach(function(matchup)
				{
					commands.push(new Command(self.agenda.setActiveMatchup,matchup,self.agenda));

					var posComparison = new PosComparison(self.movie,"QB",new Matchup(matchup));
					posComparison.setVisParent(self.vis);
					posComparison.setPosition(0,120);

					commands.push(posComparison);
					commands.push(posComparison.getRemoveCommand());
				});

				var sequence = new CommandSequence(commands);
				sequence.execute(null,cb);
			});
		}

	})(window, "2TeamComparison");
});