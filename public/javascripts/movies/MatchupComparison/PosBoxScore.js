

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/control",["DelayCommand.js"])
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
				.text("Positional Box Score")
				.attr("font-size","14pt")
				.attr("transform",self.writeTranslate(0,-20))
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
				.each("end",self.transitionCB(function()
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
			commands.push(new DelayCommand(self.getDuration(1500)));

			self.posGroups.each(function(d,i)
			{
				var comparisonResult = new PosBoxScoreInning(self.movie,d,self.movie.data["comparison" + d],self.movie.data["selectedMatchup"],d3.select(this));
				commands.push(comparisonResult);
				commands.push(new DelayCommand(self.getDuration(750)));
			});

			commands.push(new Command(self.printWinnersOutput,null,self));

			self.run(commands,cb);
		};

		scene.prototype.printWinnersOutput = function(params,cb)
		{
			var self = this;

			var lineY = 105;
			var lineInc = 17;
			var winner = self.matchup.getWinner();
			var loser = self.matchup.getLoser();
			var winnersLine;

			function addWinnerLine(line)
			{
				self.vis.append("text")
					.classed("winnerLine",1)
					.attr("transform",self.writeTranslate(200,lineY))
					.attr("font-size","9pt")
					.text(line);

				lineY += lineInc;
			}

			var winningComparisons = [];
			var teamScores = {};
			teamScores[winner.getTeamId()] = 0;
			teamScores[loser.getTeamId()] = 0;

			self.posGroups.each(function(d,i)
			{
				var pos = d;
				var comparison = self.movie.data["comparison" + pos];

				if (comparison.actual.diff > 3)
				{
					winningComparisons.push(comparison);
					teamScores[comparison.actual.winner.id] += comparison.actual.diff;
				}
			});

			var team1WinnersScore = teamScores[winner.getTeamId()];
			var team2WinnersScore = teamScores[loser.getTeamId()];
			var winnerScoreDifference = Math.abs(team1WinnersScore-team2WinnersScore);

			if (winningComparisons.length < 4 && winnerScoreDifference <= 5)
			{
				// LINE

				winnersLine = winner.getTeamName() + " beat " + loser.getTeamName() +
					" by " + numFormat(winner.getPointsScored() - loser.getPointsScored()) + " points.";

				addWinnerLine(winnersLine);


				// LINE

				winnersLine = "If you only consider the " + winningComparisons.length + " out of 9 positions where there was a clear winner...";

				addWinnerLine(winnersLine);


				// LINE(S)

				var winnersLines = _.map(_.keys(teamScores),function(teamId)
				{
					return self.matchup.getTeamById(teamId).getTeamName() + " scored " + numFormat(teamScores[teamId]) + " points.";
				});

				winnersLines.forEach(function(line)
				{
					addWinnerLine(line);
				});


				// LINE

				winnersLine = "The difference between those two point totals is " + numFormat(winnerScoreDifference) + " points.";

				addWinnerLine(winnersLine);
			}

			cb();
		};

	})(window, "PosBoxScore");
});