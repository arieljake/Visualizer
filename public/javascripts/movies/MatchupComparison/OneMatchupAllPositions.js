

define(RequireImports.new()
	.add("/js-lib/js/control",["Command.js"])
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/movies",["MovieClip.js","MovieSequence.js"])
	.add("/javascripts/movies/MatchupComparison",["MatchupHeader.js","PositionsAgenda.js","PosComparison.js","MatchupSummary.js","PressSpacebarToContinue.js"])
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

			self.header = (new MatchupHeader(self.movie,self.matchup)).setVisParent(self.vis).setPosition(0,0);
			self.agenda = (new PositionsAgenda(self.movie,self.matchup)).setVisParent(self.vis).setPosition(0,110);

			self.header.execute(null,function()
			{
				self.agenda.execute(null,function()
				{
					var commands = [];

					self.agenda.getPositions().forEach(function(position)
					{
						commands.push(new Command(self.agenda.setActivePosition,position,self.agenda));

						var posComparison = new PosComparison(self.movie,position,self.matchup);
						posComparison.setVisParent(self.vis);
						posComparison.setPosition(110,110);
						posComparison.setResultId("comparison" + position);

						commands.push(posComparison);
						commands.push(new PressSpacebarToContinue(self.movie,self.vis,{
							x: 350,
							y: 10
						}));
						commands.push(posComparison.getRemoveCommand());
					});

					self.run(commands,cb);
				});
			});
		}

	})(window, "OneMatchupAllPositions");
});