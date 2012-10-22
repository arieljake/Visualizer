

define(RequireImports.new()
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/control", ["Command.js"])
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/javascripts/movies/MatchupComparison",["PressSpacebarToContinue.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,pos,params)
		{
			this.movie = movie;
			this.pos = pos;
			this.teams = this.createTeams(params);
			this.constants = {
				bkgdWidth: 600,
				bkgdFill: "#EEE"
			}
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.createTeams = function(params)
		{
			var self = this;

			if (params.hasOwnProperty("weekNo") && params.hasOwnProperty("matchupId") && params.hasOwnProperty("teams"))
			{
				params = new Matchup(params);
			}

			if (params.toString() == "Matchup")
			{
				var matchup = params;

				var team1 = {
					name: matchup.getTeam1().getTeamName(),
					playerColl: matchup.getTeam1().getActivePlayers().toPlayerCollection().filter(function(item)
					{
						return item.getPosition() == self.pos;
					})
				};

				var team2 = {
					name: matchup.getTeam2().getTeamName(),
					playerColl: matchup.getTeam2().getActivePlayers().toPlayerCollection().filter(function(item)
					{
						return item.getPosition() == self.pos;
					})
				};

				return [team1,team2];
			}
			else if (_.isArray(params))
			{
				return params;
			}
		};

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			self.vis = self.createVis();

			self.teams[0].x = 0;
			self.teams[0].y = 40;
			self.teams[0].opponent = self.teams[1];

			self.teams[1].x = self.constants.bkgdWidth / 2;
			self.teams[1].y = 40;
			self.teams[1].opponent = self.teams[0];

			self.vis.append("rect")
				.attr("width",self.constants.bkgdWidth)
				.attr("height",270)
				.attr("fill",self.constants.bkgdFill)
				.attr("stroke","none");

			self.vis.append("text").classed("title",1)
				.text(self.pos + " Comparison")
				.attr("font-size","18pt")
				.attr("fill","#930")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0,-3);
				})
				.attr("opacity",0)
				.transition()
				.duration(1000)
				.attr("opacity",1);

			self.vis.append("path")
				.attr("d","M 0 0 L 0 0 z")
				.attr("y",21)
				.attr("x",0)
				.attr("fill","none")
				.attr("stroke","#930")
				.attr("stroke-width",2)
				.transition()
				.duration(1000)
				.attr("d","M 0 0 L " + self.constants.bkgdWidth + " 0 z")
				.each("end",Transitions.cb(function()
			{
				self.callIn("showTeams",100,cb,self.teams);
			}));
		};

		scene.prototype.showTeams = function(teams,cb)
		{
			var self = this;

			self.teamGroups = self.vis.selectAll("g.team").data(teams).enter().append("g").classed("team",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(d.x, d.y);
				});

			self.teamGroups.append("text").classed("teamName",1)
				.text(function(d,i){ return d.name; })
				.attr("font-size","13pt")
				.attr("opacity",.8)
				.attr("fill","#666")
				.attr("transform",self.writeTranslate(10,5));

			self.callIn("showPlayers",1000,cb);
		};

		scene.prototype.showPlayers = function(params,cb)
		{
			var self = this;

			self.playerGroups = self.teamGroups.selectAll("g.player").data(function(d,i){ return d.playerColl.toArray(); }).enter().append("g").classed("player",1)
				.attr("transform",function(d,i) {
					return self.writeTranslate(0, 45 * (i+1));
				});

			self.callIn("showPlayerNames",100,cb);
		};

		scene.prototype.showPlayerNames = function(params,cb)
		{
			var self = this;

			self.playerGroups.append("text")
				.text("player: ")
				.attr("font-size","9pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, 10);
				});

			self.playerGroups.append("text")
				.text(function(d,i) {
					return d.getPlayerName();
				})
				.attr("font-size","9pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(75, 10);
				});

			self.callIn("showProjectedPoints",1000,cb);
		};

		scene.prototype.showProjectedPoints = function(params,cb)
		{
			var self = this;

			self.playerGroups.append("text")
				.text("projected: ")
				.attr("font-size","9pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, 20);
				});

			self.playerGroups.append("text")
				.text(function(d,i) {
					return d.getProjectedPoints()
				})
				.attr("font-size","9pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(75, 20);
				});

			self.callIn("showActualPoints",1000,cb);
		};

		scene.prototype.showActualPoints = function(params,cb)
		{
			var self = this;

			self.playerGroups.append("text")
				.text("actual: ")
				.attr("font-size","9pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, 30);
				});

			self.playerGroups.append("text")
				.text(function(d,i) {
					return d.getActualPoints()
				})
				.attr("font-size","9pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(75, 30);
				});

			self.callIn("showPlayerSummary",1000,cb);
		};

		scene.prototype.showPlayerSummary = function(params,cb)
		{
			var self = this;

			self.playerSummaryGroups = self.playerGroups.append("g")
				.classed("summary",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(225, 15);
				});

			self.playerSummaryGroups.append("rect")
				.attr("width",75)
				.attr("height",50)
				.attr("fill",self.constants.bkgdFill)
				.attr("stroke","none");

			self.playerSummaryGroups.append("text")
				.text(function(d,i)
				{
					d.actualToProjectedValue = numFormat(Math.abs(d.getActualPoints() - d.getProjectedPoints()));
					d.actualToProjectedPlusMinus = (d.getActualPoints() - d.getProjectedPoints()) > 0 ? "+" : "-";

					return d.actualToProjectedPlusMinus + d.actualToProjectedValue;
				})
				.attr("text-anchor","middle")
				.attr("font-size","16pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0, 0);
				})
				.attr("opacity",0)
				.transition()
				.duration(1250)
				.attr("opacity",1);

			self.playerSummaryGroups.append("text")
				.text(function(d,i)
				{
					return d.actualToProjectedPlusMinus == "-" ? "under projected" : "over projected";
				})
				.attr("text-anchor","middle")
				.attr("font-size","8pt")
				.attr("fill",function(d,i)
				{
					return d.actualToProjectedPlusMinus == "-" ? "#F00" : "#000";
				})
				.attr("transform", function(d,i) {
					return self.writeTranslate(5, 15);
				})
				.attr("opacity",0)
				.transition()
				.duration(1250)
				.attr("opacity",1)
				.each("end",Transitions.cb(function()
			{
				self.callIn("showPosSummary",1000,cb);
			}));
		};

		scene.prototype.showPosSummary = function(params,cb)
		{
			var self = this;

			self.vis.append("text")
				.text("projected " + self.pos + " result")
				.attr("opacity",0)
				.attr("font-size","13pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0,200);
				})
				.transition()
				.duration(100)
				.delay(0)
				.attr("opacity",1);

			self.vis.append("text")
				.text("actual " + self.pos + " result")
				.attr("opacity",0)
				.attr("font-size","13pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0, 225);
				})
				.transition()
				.duration(100)
				.delay(1000)
				.attr("opacity",1);

			self.posSummaryGroup = self.teamGroups.append("g").classed("posSummary",1);

			self.posSummaryGroup.append("text")
				.text(function(d,i)
				{
					var teamPlayers = d.playerColl;
					var oppPlayers = d.opponent.playerColl;

					if (teamPlayers.getPointsProjected() > oppPlayers.getPointsProjected())
					{
						return "+ " + numFormat(teamPlayers.getPointsProjected() - oppPlayers.getPointsProjected());
					}
					else
					{
						return "";
					}
				})
				.attr("opacity",0)
				.attr("font-size","18pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(185,160);
				})
				.transition()
				.duration(100)
				.delay(500)
				.attr("opacity",1);


			self.posSummaryGroup.append("text")
				.text(function(d,i)
				{
					var teamPlayers = d.playerColl;
					var oppPlayers = d.opponent.playerColl;

					if (teamPlayers.getPointsScored() > oppPlayers.getPointsScored())
					{
						return "+ " + numFormat(teamPlayers.getPointsScored() - oppPlayers.getPointsScored());
					}
					else
					{
						return "";
					}
				})
				.attr("opacity",0)
				.attr("font-size","18pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(185,185);
				})
				.transition()
				.duration(100)
				.delay(1500)
				.attr("opacity",1);

			// DONE
			setTimeout(function()
			{
				var pressSpacebar = new PressSpacebarToContinue(self.movie,self.vis);
				pressSpacebar.execute({
					x: 215,
					y: 220
				},function()
				{
					self.emit("end");
				});
			},4000);
		};

	})(window, "PosComparison");
});