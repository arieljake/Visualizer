

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/10model/",["TeamPerformance.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Teams.js"])
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
			self.vis.attr("opacity",0);

			self.vis.append("image")
				.attr("xlink:href","/images/icons/nflMatchup.png")
				.attr("width",300)
				.attr("height",200)
				.attr("transform",self.writeTranslate(200,-50));

			self.team1Group = self.vis.append("g").classed("team1",1)
				.attr("transform",self.writeTranslate(240,25));
			self.team2Group = self.vis.append("g").classed("team2",1)
				.attr("transform",self.writeTranslate(240,65));

			var matchup = new Matchup(self.matchup);

			self.matchupTitle = self.vis.append("text")
				.text("Week " + matchup.getWeek() + " Matchup Comparison")
				.attr("transform",self.writeTranslate(250,8))
				.attr("font-weight","bold");

			self.drawTeamGroup(self.team1Group,self.matchup.teams[0]);
			self.drawTeamGroup(self.team2Group,self.matchup.teams[1]);

			self.vis.transition()
				.duration(self.getDuration(1500))
				.attr("opacity",1)
				.each("end", self.transitionCB(cb));
		};

		scene.prototype.drawTeamGroup = function(group,team)
		{
			var self = this;
			var teamPerformance = new TeamPerformance(team);

			group.append("text")
				.text(teamPerformance.getTeamName())
				.attr("font-size",16)
				.attr("x",43)
				.attr("y",14);

			group.append("text")
				.text(teamPerformance.getTeamRecord())
				.attr("font-size",14)
				.attr("x",44)
				.attr("y",28);

			group.append("image")
				.attr("width",35)
				.attr("height",35)
				.attr("xlink:href","/images/teams/" + teamPerformance.getTeamId() + ".png");
		}

	})(window, "MatchupHeader");
});