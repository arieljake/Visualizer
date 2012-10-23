

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.toArray(),function()
{
	(function (context, sceneName)
	{
		var scene = context[sceneName] = function (movie)
		{
			this.name = sceneName;
			this.movie = movie;
		};

		scene.prototype = new MovieClip();

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			var movie = self.movie;

			var textGroup = movie.vis.selectAll(".textGroup");
			var teamBkgd = movie.vis.selectAll(".team .teamBkgd");
			var darkColor = d3.hsl(movie.constants.teamRed);
			var lightColor = d3.hsl(darkColor.brighter(4));

			textGroup.append("text")
				.text("Let's start by assigning colors to teams based on ranking")
				.attr("font-size","30")
				.attr("fill","black");

			var minWinPct = d3.min(movie.data.teams,function(d) { return d.standing.team.winPct; });
			var maxWinPct = d3.max(movie.data.teams,function(d) { return d.standing.team.winPct; });
			var teamColorFn = d3.scale.linear().domain([minWinPct,maxWinPct]).range([lightColor,darkColor]);

			teamBkgd.transition()
				.duration(self.getDuration(2000))
				.attr("fill", function(d,i) { return teamColorFn(d.standing.team.winPct); })
				.each("end",self.transitionCB(function()
			{
				textGroup.append("text")
					.text("Now if we add points scored with matching colors...")
					.attr("font-size","30")
					.attr("fill","black")
					.attr("y", 40);

				setTimeout(function()
				{
					var textGroupPos = movie.getPositionsOf(textGroup);
					var teamGroupPos = movie.getPositionsOf(movie.teamGroups);

					textGroup.transition()
						.duration(self.getDuration(1000))
						.attr("transform",function(d,i)
						{
							var x = textGroupPos[i].x + 200;
							var y = textGroupPos[i].y;

							return self.writeTranslate(x,y);
						})
						.each("end",self.transitionCB(function()
					{
						var teamPointsGroup = movie.teamPointsGroup = movie.vis.selectAll("g.teamPoints").data([movie.data.teams]).enter()
							.append("g")
							.classed("teamPoints",1);

						var teamPoints = movie.teamPoints = teamPointsGroup.selectAll("g.teamPoint").data(movie.data.teams).enter()
							.append("g")
							.classed("teamPoint",1)
							.attr("transform",function(d,i)
							{
								var x = textGroupPos[0].x;
								var y = teamGroupPos[i].y;

								return self.writeTranslate(x,y);
							});

						var minPts = d3.min(movie.data.teams,function(d) { return d.standing.team.ptsFor; });
						var maxPts = d3.max(movie.data.teams,function(d) { return d.standing.team.ptsFor; });
						var teamPointsColors = d3.scale.linear().domain([minPts,maxPts]).range([lightColor,darkColor]);

						teamPoints.append("rect")
							.attr("x",0)
							.attr("y",0)
							.attr("width",50)
							.attr("height",50)
							.attr("fill", function(d,i) { return teamPointsColors(d.standing.team.ptsFor); })
							.style("stroke","black");

						teamPoints.append("text")
							.text(function(d,i){ return d.standing.team.ptsFor.toFixed(0); })
							.attr("font-size",24)
							.attr("y",35)
							.attr("x",6);

						cb();
					}));

				},self.getDuration(1000));
			}));
		}

	})(window, "AveragesPrep");
});