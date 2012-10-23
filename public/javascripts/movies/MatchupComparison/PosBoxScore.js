

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/control",["DelayCommand.js"])
	.add("/js-lib/js/graphs",["Transitions.js"])
	.add("/javascripts/movies/MatchupComparison",["PosBoxScoreInning.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,posGroups,matchup)
		{
			this.movie = movie;
			this.posGroups = posGroups;
			this.matchup = new Matchup(matchup);
			this.constants = {
				teamLabelWidth: 200
			}
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			self.vis = self.createVis();

			self.vis.append("text")
				.text("Box Score")
				.attr("font-size","14pt")
				.attr("opacity",0)
				.transition()
				.duration(self.getDuration(1000))
				.attr("opacity",1);


			self.posGroups.transition()
				.duration(self.getDuration(1500))
				.attr("fill", "#000")
				.attr("transform", function(d,i)
				{
					return self.writeTranslate(self.posX + self.constants.teamLabelWidth + (51*i),self.posY);
				});

			self.posGroups.selectAll("rect")
				.transition()
				.duration(self.getDuration(1500))
				.attr("width",50)
				.attr("height",40)
				.attr("transform", function(d,i)
				{
					return self.writeTranslate(0,15);
				});

			self.posGroups.selectAll("text")
				.transition()
				.duration(self.getDuration(1500))
				.attr("x",0)
				.each("end",Transitions.cb(function()
			{
				var teamRows = [
					self.matchup.getTeam1().getTeamName(),
					self.matchup.getTeam2().getTeamName(),
					"Winner (>3 points diff)"
				];

				var teamGroups = self.vis.selectAll("g.team").data(teamRows).enter().append("g").classed("team",1)
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(0,35 + (15*i) + (i == 2 ? 10 : 0));
					});

				teamGroups.append("text")
					.text(function(d) { return d; })
					.attr("font-weight",function(d,i)
					{
						return i == 2 ? "bold" : "normal";
					});
			}));

			var commands = [];
			commands.push(new DelayCommand(self.getDuration(750)));

			self.posGroups.each(function(d,i)
			{
				var comparisonResult = new PosBoxScoreInning(self.movie,d,self.movie.data["comparison" + d],self.movie.data["selectedMatchup"],d3.select(this));
				commands.push(comparisonResult);
				commands.push(new DelayCommand(self.getDuration(1000)));
			});

			self.run(commands,cb);
		}

	})(window, "PosBoxScore");
});