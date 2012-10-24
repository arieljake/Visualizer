

define(RequireImports.new()
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/control", ["Command.js"])
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/logging",["Log.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,pos,params)
		{
			var self = this;

			this.movie = movie;
			this.pos = pos;
			this.teams = this.createTeams(params);
			this.constants = {};
			this.constants.bkgdFill = "#EEE";
			this.constants.bkgdWidth = 800;
			this.constants.teamGroupWidth = 399;
			this.constants.teamHeaderHeight = 30;
			this.constants.playerRowHeight = 80;
			this.constants.posStatsHeight = 50;
			this.constants.posWinnerHeight = 30;
			this.constants.playerRowY = this.constants.teamHeaderHeight + 1;
			this.constants.posStatsY = this.constants.playerRowY + (this.constants.playerRowHeight * self.teams[0].playerColl.toArray().length) + 1;
			this.constants.posWinnerY = this.constants.posStatsY + this.constants.posStatsHeight + 1;
			this.constants.stats = [
					{
						name: "projected",
						label: "projected " + self.pos + " result:",
						fill: "#333",
						y: 17,
						calculate: function()
						{
							var teamPlayers = self.teams[0].playerColl;
							var teamProjection = teamPlayers.getPointsProjected();

							var oppPlayers = self.teams[1].playerColl;
							var oppProjection = oppPlayers.getPointsProjected();

							if (teamProjection > oppProjection)
							{
								return {
									winner: {
										id: self.teams[0].id,
										name: self.teams[0].name
									},
									diff: parseFloat(numFormat(teamProjection - oppProjection))
								};
							}
							else
							{
								return {
									winner: {
										id: self.teams[1].id,
										name: self.teams[1].name
									},
									diff: parseFloat(numFormat(oppProjection - teamProjection))
								};
							}
						}
					},
					{
						name: "actual",
						label: "actual " + self.pos + " result:",
						fill: "#333",
						y: 42,
						calculate: function()
						{
							var teamPlayers = self.teams[0].playerColl;
							var teamScore = teamPlayers.getPointsScored();

							var oppPlayers = self.teams[1].playerColl;
							var oppScore = oppPlayers.getPointsScored();

							if (teamScore > oppScore)
							{
								return {
									winner: {
										id: self.teams[0].id,
										name: self.teams[0].name
									},
									diff: parseFloat(numFormat(teamScore - oppScore))
								}
							}
							else
							{
								return {
									winner: {
										id: self.teams[1].id,
										name: self.teams[1].name
									},
									diff: parseFloat(numFormat(oppScore - teamScore))
								}
							}
						}
					}
				];
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
					id: matchup.getTeam1().getTeamId(),
					name: matchup.getTeam1().getTeamName(),
					playerColl: matchup.getTeam1().getActivePlayers().toPlayerCollection().filter(function(item)
					{
						return item.getSlot() == self.pos;
					})
				};

				var team2 = {
					id: matchup.getTeam2().getTeamId(),
					name: matchup.getTeam2().getTeamName(),
					playerColl: matchup.getTeam2().getActivePlayers().toPlayerCollection().filter(function(item)
					{
						return item.getSlot() == self.pos;
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
			self.teams[0].y = 20;
			self.teams[0].opponent = self.teams[1];

			self.teams[1].x = self.constants.bkgdWidth / 2;
			self.teams[1].y = 20;
			self.teams[1].opponent = self.teams[0];

			self.vis.append("text").classed("title",1)
				.text(self.pos + " Comparison")
				.attr("font-size","18pt")
				.attr("fill",self.movie.constants.positionRed)
				.attr("transform", function(d,i) {
					return self.writeTranslate(0,18);
				})
				.attr("opacity",0)
				.transition()
				.duration(self.getDuration(1000))
				.attr("opacity",1)
				.each("end",self.transitionCB);

			self.vis.append("path")
				.attr("d","M 0 22 L 0 22 z")
				.attr("fill","none")
				.attr("stroke",self.movie.constants.positionRed)
				.attr("stroke-width",2)
				.transition()
				.duration(self.getDuration(1000))
				.attr("d","M 0 22 L " + self.constants.bkgdWidth + " 22 z")
				.each("end",self.transitionCB(function()
			{
				self.contentSection = self.vis.append("g").classed("content",1)
					.attr("transform", self.writeTranslate(0, 23));

				self.callIn("showTeams",500,cb,self.teams);
			}));
		};

		scene.prototype.showTeams = function(teams,cb)
		{
			var self = this;

			self.teamGroups = self.contentSection.selectAll("g.team").data(teams).enter().append("g").classed("team",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(d.x, 0);
				});

			self.teamGroups.append("rect")
				.attr("width",self.constants.teamGroupWidth)
				.attr("height",self.constants.teamHeaderHeight)
				.attr("fill",self.constants.bkgdFill)
				.attr("stroke","none");

			self.teamGroups.append("text")
				.classed("teamName",1)
				.text(function(d,i){ return d.name; })
				.attr("font-size","13pt")
				.attr("opacity",.8)
				.attr("fill","#333")
				.attr("transform",self.writeTranslate(10,22));

			self.callIn("showPlayers",0,cb);
		};

		scene.prototype.showPlayers = function(params,cb)
		{
			var self = this;

			self.playerGroups = self.teamGroups.selectAll("g.player").data(function(d,i){ return d.playerColl.toArray(); }).enter().append("g").classed("player",1)
				.attr("transform",function(d,i) {
					return self.writeTranslate(0, self.constants.teamHeaderHeight + (self.constants.playerRowHeight * i) + 1);
				});

			self.playerGroups.append("rect")
				.attr("width",self.constants.teamGroupWidth)
				.attr("height",self.constants.playerRowHeight-1)
				.attr("fill",self.constants.bkgdFill)
				.attr("stroke","none");

			self.callIn("showPlayerNames",100,cb);
		};

		scene.prototype.showPlayerNames = function(params,cb)
		{
			var self = this;

			self.playerGroups.append("rect")
				.attr("width",45)
				.attr("height",45)
				.attr("stroke","#666")
				.attr("fill", "#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, 10);
				});

			self.playerGroups.append("text")
				.text(function(d,i) {
					return d.getPlayerName();
				})
				.attr("font-size","9pt")
				.attr("font-weight","bold")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, 70);
				});

			self.showProjectedPoints(null,cb);
		};

		scene.prototype.showProjectedPoints = function(params,cb)
		{
			var self = this;

			self.projectedPointGroups = self.playerGroups.append("g")
				.classed("actualPointGroup",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(100, 35);
				});

			self.projectedPointGroups.append("text")
				.text(function(d,i) {
					return d.getProjectedPoints();
				})
				.attr("font-size","16pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0, 0);
				});

			self.projectedPointGroups.append("text")
				.text("projected")
				.attr("font-size","8pt")
				.attr("transform", function(d,i) {
					return self.writeTranslate(5, 15);
				});

			self.showActualPoints(null,cb);
		};

		scene.prototype.showActualPoints = function(params,cb)
		{
			var self = this;

			self.actualPointGroups = self.playerGroups.append("g")
				.classed("actualPointGroup",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(200, 35);
				});

			self.actualPointGroups.append("text")
				.text(function(d,i) {
					return d.getActualPoints();
				})
				.attr("font-size","16pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0, 0);
				});

			self.actualPointGroups.append("text")
				.text("scored")
				.attr("font-size","8pt")
				.attr("transform", function(d,i) {
					return self.writeTranslate(5, 15);
				});

			self.showPlayerSummary(null,cb);
		};

		scene.prototype.showPlayerSummary = function(params,cb)
		{
			var self = this;

			self.playerSummaryGroups = self.playerGroups.append("g")
				.classed("summary",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(325, 35);
				});

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
				});

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
				});

			self.callIn("showPosStats",0,cb);
		};

		scene.prototype.showPosStats = function(params,cb)
		{
			var self = this;

			self.posStatsGroup = self.contentSection.append("g").classed("posStatsGroup",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(0,self.constants.posStatsY);
				});

			self.posStatsGroup.append("rect")
				.attr("width",self.constants.bkgdWidth)
				.attr("height",self.constants.posStatsHeight)
				.attr("fill",self.constants.bkgdFill)
				.attr("stroke","none");

			self.posStatGroups = self.posStatsGroup.selectAll("g.posStatGroup").data(self.constants.stats).enter().append("g").classed("posSummaryStatGroup",1);

			self.posStatGroups.append("text")
				.text(function(d,i) { return d.label; })
				.attr("font-size","10pt")
				.attr("font-weight","bold")
				.attr("fill",function(d,i) { return d.fill; })
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, d.y);
				});

			self.posStatGroups.append("text")
				.text(function(d,i) {
					var val = d.calculate();
					return val.winner.name + " +" + val.diff;
				})
				.attr("font-size","10pt")
				.attr("fill",function(d,i) { return d.fill; })
				.attr("transform", function(d,i) {
					return self.writeTranslate(210, d.y);
				});

			self.callIn("showPosWinner",0,cb);
		};

		scene.prototype.showPosWinner = function(params,cb)
		{
			var self = this;

			self.posWinnerGroup = self.contentSection.append("g").classed("posWinnerGroup",1)
				.attr("transform", function(d,i) {
					return self.writeTranslate(0,self.constants.posWinnerY);
				});

			self.posWinnerGroup.append("rect")
				.attr("width",self.constants.bkgdWidth)
				.attr("height",self.constants.posWinnerHeight)
				.attr("fill",self.constants.bkgdFill)
				.attr("stroke","none");

			self.posWinnerGroup.append("text")
				.text(self.pos + " clear winner (>3 points): ")
				.attr("font-size","10pt")
				.attr("font-weight","bold")
				.attr("fill","#000")
				.attr("transform", self.writeTranslate(10, 20));

			var actualResult = self.constants.stats[1].calculate();

			self.posWinnerGroup.append("text")
				.text(function(d,i)
				{
					if (actualResult.diff > 3)
					{
						return actualResult.winner.name;
					}
					else
					{
						return "none";
					}
				})
				.attr("font-size","10pt")
				.attr("fill","#000")
				.attr("transform", self.writeTranslate(210, 20));

			if (actualResult.diff > 3)
			{
				self.posWinnerGroup.select("rect")
					.transition()
					.duration(self.getDuration(500))
					.delay(self.getDuration(1250))
					.attr("fill","#FFC");
			}

			self.callIn("finish",500,cb);
		};

		scene.prototype.finish = function(params,cb)
		{
			var self = this;

			var results = {
				position: self.pos
			};

			self.constants.stats.forEach(function(stat)
			{
				results[stat.name] = stat.calculate();
			});

			Log.log("PosComparison displayed for " + self.pos);

			self.emit("end",results);
		}

	})(window, "PosComparison");
});