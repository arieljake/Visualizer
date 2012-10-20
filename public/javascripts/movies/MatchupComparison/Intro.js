

define(RequireImports.new()
	.add("/javascripts/movies/",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Matchups.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie)
		{
			this.movie = movie;

			_.extend(this.movie.constants,{
				matchupGroupH: 100,
				matchupGroupSpacing: 10
			});
		};

		scene.prototype = new MovieClip();

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Matchups.get({weekNo: 6},function(err,matchups)
			{
				self.movie.data.matchups = matchups;

				var vis = self.movie.vis;

				var matchupGroups = self.movie.matchupGroups = vis.selectAll("g.matchup").data(matchups).enter()
					.append("g")
					.classed("matchup",1)
					.attr("transform",function(d,i)
					{
						var x = 20;
						var y = 40 + (i*(self.movie.constants.matchupGroupH + self.movie.constants.matchupGroupSpacing));

						return self.writeTranslate(x,y);
					});

				var teamGroups = matchupGroups.selectAll("g.team").data(function(d,i) { return d.teams; }).enter()
					.append("g")
					.classed("team",1);

				teamGroups.append("text")
					.text(function(d,i) { return d.name; })
					.attr("font-size","16")
					.attr("font-weight","16")
					.attr("transform",function(d,i)
					{
						var x = 0;
						var y = (i*40);

						return self.writeTranslate(x,y);
					});

				cb();
			});
		}

	})(window, "Intro");
});