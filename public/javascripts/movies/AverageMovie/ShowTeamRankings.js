

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets",["Standings.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
		};

		scene.prototype = new MovieClip();

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Standings.get(null,function(err,standings)
			{
				self.data = standings;

				var movie = self.movie;
				movie.data.standings = standings;

				var bkgdPos = movie.getPositionsOf(movie.teamBkgds);

				movie.teamGroups.each(function(d,i)
				{
					var standing = _.filter(standings,function(standing)
					{
						return standing.team.id == d.id;
					})[0];

					d.standing = standing;
				});

				movie.teamRankings = movie.teamGroups.append("text")
					.classed("ranking",1)
					.style("font-size","30")
					.text(function(d,i)
					{
						return d.standing.rank;
					})
					.attr("x",function(d,i)
					{
						return bkgdPos[i].x + 10 + (d.standing.rank < 10 ? 7 : -3);
					})
					.attr("y",function(d,i)
					{
						return bkgdPos[i].y + 37;
					});

				movie.teamRecords = movie.teamGroups.append("text")
					.classed("record",1)
					.style("font-size",20)
					.style("font-weight","bold")
					.text(function(d,i)
					{
						return d.standing.team.record;
					})
					.attr("x",function(d,i){ return 70; })
					.attr("y",function(d,i){ return 47; })

				movie.teamGroups.transition()
					.duration(self.getDuration(1000))
					.attr("transform",function(d,i)
					{
						var x = movie.getX(this);
						var y = (63 * (d.standing.rank));
						var transform = "translate(" + x + "," + y + ")";

						return transform;
					})
					.each("end",self.transitionCB(cb));
			});
		}

	})(window, "ShowTeamRankings");
});