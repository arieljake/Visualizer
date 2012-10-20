

define(RequireImports.new()
	.add("/js-lib/js/yahoo/10model/",["Matchup.js"])
	.add("/js-lib/js/control", ["Command.js"])
	.add("/javascripts/movies/",["MovieClip.js","PressSpacebarToContinue.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie,pos,matchup)
		{
			this.movie = movie;
			this.pos = pos;
			this.matchup = new Matchup(matchup);
		};

		scene.prototype = new MovieClip("posComparisonGroup");

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			self.vis = self.createVis()
				.attr("transform",self.writeTranslate(300,135));
			self.once("end", function()
			{
				cb();
			});

			var team1 = {
				name: self.matchup.getTeam1().getTeamName(),
				playerColl: self.matchup.getTeam1().getActivePlayers().toPlayerCollection().filter(function(item)
				{
					return item.getPosition() == self.pos;
				}),
				x: 5,
				y: 40
			};

			var team2 = {
				name: self.matchup.getTeam2().getTeamName(),
				playerColl: self.matchup.getTeam2().getActivePlayers().toPlayerCollection().filter(function(item)
				{
					return item.getPosition() == self.pos;
				}),
				x: 225,
				y: 40
			};

			team1.opponent = team2;
			team2.opponent = team1;
			var teams = [team1,team2];

			self.vis.append("text").classed("title",1)
				.text(self.pos + " Comparison")
				.attr("font-size","18pt")
				.attr("fill","#930")
				.attr("transform", function(d,i) {
					return self.writeTranslate(0,0);
				})
				.attr("opacity",0)
				.transition()
				.duration(1250)
				.attr("opacity",1);

			self.callIn("showTeams",950,cb,teams);
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
				.attr("font-size","11pt")
				.attr("transform",self.writeTranslate(0,5))
				.attr("opacity",0)
				.transition()
				.duration(1150)
				.delay(600)
				.attr("opacity",1)
				.each("end", Transitions.cb(function()
			{
				var rectW = 200;
				var rectH = 140;
				var rectDist = (2*rectW) + (2*rectH);
				self.teamGroups.append("rect")
					.attr("width",rectW)
					.attr("height",rectH)
					.attr("y",-15)
					.attr("x",-5)
					.attr("fill","none")
					.attr("stroke","#930")
					.style("stroke-dasharray","" + rectDist + "," + rectDist)
					.style("stroke-dashoffset",rectDist)
					.transition()
					.duration(5000)
					.style("stroke-dashoffset",0)
					.each("end",Transitions.cb(function()
				{
					self.callIn("showPlayers",500,cb);
				}));
			}));



			// self.callIn("showPlayers",2500,cb);
		};

		scene.prototype.showPlayers = function(params,cb)
		{
			var self = this;

			self.playerGroups = self.teamGroups.selectAll("g.player").data(function(d,i){ return d.playerColl.toArray(); }).enter().append("g").classed("player",1)
				.attr("transform",function(d,i) {
					return self.writeTranslate(0, 20);
				});
			self.playerGroups.append("text")
				.text("player: ")
				.attr("font-size","9pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10, 10);
				});

			setTimeout(function()
			{
				self.playerGroups.append("text")
					.text(function(d,i) {
						return d.getPlayerName();
					})
					.attr("font-size","9pt")
					.attr("fill","#360")
					.attr("transform", function(d,i) {
						return self.writeTranslate(75, 10);
					});

				self.callIn("showProjectedPoints",1250,cb);

			},750);
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

			setTimeout(function()
			{
				self.playerGroups.append("text")
					.text(function(d,i) {
						return d.getProjectedPoints()
					})
					.attr("font-size","9pt")
					.attr("fill","#360")
					.attr("transform", function(d,i) {
						return self.writeTranslate(75, 20);
					});

				self.callIn("showActualPoints",1250,cb);

			},750);
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

			setTimeout(function()
			{
				self.playerGroups.append("text")
					.text(function(d,i) {
						return d.getActualPoints()
					})
					.attr("font-size","9pt")
					.attr("fill","#360")
					.attr("transform", function(d,i) {
						return self.writeTranslate(75, 30);
					});

				self.callIn("showPlayerSummary",1250,cb);

			},750);
		};

		/**
		 *
		 * - start at point 0
		 * - using rate (100 pixels/sec) * time (interval == 1000 ms), calculate max distance traveled (100 pixels)
		 * - goto next point
		 *   - if (no more points) then (done)
		 *   - draw line towards next point with distance Min(100pixels,distanceToPoint1)
		 *   - if (distanceToPoint1-100pixels LT 0) then (advance next point, goto next point)
		 */

		scene.prototype.showPlayerSummary = function(params,cb)
		{
			var self = this;

			self.playerGroups.append("text")
				.text(function(d,i)
				{
					d.actualToProjectedValue = numFormat(Math.abs(d.getActualPoints() - d.getProjectedPoints()));
					d.actualToProjectedPlusMinus = (d.getActualPoints() - d.getProjectedPoints()) > 0 ? "+" : "-";

					return d.actualToProjectedPlusMinus + d.actualToProjectedValue;
				})
				.attr("text-anchor","middle")
				.attr("font-size","20pt")
				.attr("fill","#360")
				.attr("transform", function(d,i) {
					return self.writeTranslate(90, 75);
				})
				.attr("opacity",0)
				.transition()
				.duration(1250)
				.attr("opacity",1);

			self.playerGroups.append("text")
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
					return self.writeTranslate(95, 90);
				})
				.attr("opacity",0)
				.transition()
				.duration(1250)
				.attr("opacity",1)
				.each("end",Transitions.cb(function()
			{
				setTimeout(function()
				{
					var pressSpacebar = new PressSpacebarToContinue(self.movie,self.vis);
					pressSpacebar.execute({
						x: 110,
						y: 160
					},function()
					{
						self.showPosSummary();
					});
				},2000);
			}));
		};

		scene.prototype.showPosSummary = function(params,cb)
		{
			var self = this;

			self.playerGroups.remove();
			self.posSummaryGroup = self.vis.append("g").classed("posSummary",1);

			self.posSummaryGroup.append("rect")
				.attr("width",10)
				.attr("height",10)
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(10,180);
				});

			self.posSummaryGroup.append("text")
				.text("projected " + self.pos + " result")
				.attr("font-size","18pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(30,195);
				});

			self.posSummaryGroup.selectAll(".projected").data(self.teamGroups.data()).enter().append("text")
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
				.attr("font-size","18pt")
				.attr("fill","#3C3")
				.attr("transform", function(d,i) {
					return self.writeTranslate(d.x + 40,d.y + 60);
				});

			setTimeout(function()
			{
				self.posSummaryGroup.append("rect")
					.attr("width",10)
					.attr("height",10)
					.attr("fill","#360")
					.attr("transform", function(d,i) {
						return self.writeTranslate(10, 210);
					});

				self.posSummaryGroup.append("text")
					.text("actual " + self.pos + " result")
					.attr("font-size","18pt")
					.attr("fill","#360")
					.attr("transform", function(d,i) {
						return self.writeTranslate(30, 225);
					});

				self.posSummaryGroup.selectAll(".projected").data(self.teamGroups.data()).enter().append("text")
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
					.attr("font-size","18pt")
					.attr("fill","#360")
					.attr("transform", function(d,i) {
						return self.writeTranslate(d.x + 40, d.y + 100);
					});

				// DONE
				setTimeout(function()
				{
					var pressSpacebar = new PressSpacebarToContinue(self.movie,self.vis);
					pressSpacebar.execute({
						x: 110,
						y: 160
					},function()
					{
						self.emit("end");
					});
				},2000);

			},1500);
		};

	})(window, "PosComparison");
});