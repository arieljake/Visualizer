

define(RequireImports.new()
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Matchups.js"])
	.add("/js-lib/js/control", ["Command.js","CommandSequence.js","DelayCommand.js"])
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

			Matchups.get({weekNo: 6},function(err,matchups)
			{
				self.data = matchups;

				var qbComparisons = [];

				matchups.forEach(function(matchup)
				{
					var posComparison = new PosComparison(self.movie,"QB",matchup);
					qbComparisons.push(posComparison);
					qbComparisons.push(posComparison.getRemoveCommand());
				});

				var sequence = new CommandSequence(qbComparisons);
				sequence.execute(null,cb);
			});
		}

	})(window, "QBComparisons");
});