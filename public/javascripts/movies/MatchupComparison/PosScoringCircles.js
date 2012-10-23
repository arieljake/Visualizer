

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Teams.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
			this.constants = {
				explanations: [
					"Circle size corresponds to number of points scored.",
					"Positions with no clear winner are colored gray."
				]
			}
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			self.vis = self.createVis();
			self.data = self.createPackData();

			var width = 600;
			var height = 400;
			var format = d3.format(",d");
			var fill = d3.scale.category20();

			var pack = d3.layout.pack()
				.size([width - 4, height - 4])
				.value(function(d) { return d.size; });

			self.vis.append("text")
				.text("Scoring Breakdown per team")
				.attr("font-size","14pt")
				.attr("opacity",0)
				.transition()
				.duration(self.getDuration(1000))
				.attr("opacity",1)
				.each("end",self.transitionCB(function()
			{
				self.vis.selectAll("text.explain").data(self.constants.explanations).enter().append("text").classed("explain",1)
					.text(function(d){ return d; })
					.attr("y", function(d,i) { return 15*(i+2); })
					.attr("font-size","9pt");

				var node = self.vis.data([self.data]).selectAll("g.node").data(pack.nodes).enter().append("g")
					.attr("transform", function(d) { return "translate(" + (d.x+200) + "," + (d.y-50) + ")"; });

				node.append("circle")
					.attr("r", function(d) { return d.r; })
					.attr("fill",function(d,i)
					{
						if (d.root == true)
							return "none";

						if (d.children)
							return "#FFF";

						if (self.movie.data["comparison" + d.name].actual.diff < 3)
							return "#EEE";

						return fill(d.name);
					});

				node.filter(function(d){ return d.root != true; }).append("text")
					.text(function(d){ return d.name.substring(0, d.r / 3); })
					.attr("text-anchor", "middle")
					.attr("dy", function(d)
					{
						if (d.children)
							return (-1 * d.r) - 18;

						return "0em";
					})
					.attr("fill",function(d,i)
					{
						if (!d.children && self.movie.data["comparison" + d.name].actual.diff < 3)
							return "#999";

						return "#000";
					})
					.attr("font-weight",function(d,i)
					{
						if (d.children)
							return "bold";

						return "normal";
					})
					.attr("font-size",function(d,i)
					{
						if (d.children)
							return "12pt";

						return "8pt";
					});

				node.filter(function(d){ return d.root != true; }).append("text")
					.text(function(d)
					{
						if (d.children)
							return numFormat(d.activePlayers.getPointsScored()) + " pts";
						else
							return numFormat(d.size);
					})
					.attr("text-anchor", "middle")
					.attr("dy", function(d)
					{
						if (d.children)
							return (-1 * d.r);
						else
							return "1em";
					})
					.attr("fill","#000")
					.attr("font-size",function(d,i)
					{
						if (d.children)
							return "12pt";

						return "8pt";
					});

				cb();

			}));
		}

		scene.prototype.createPackData = function()
		{
			var self = this;
			var matchup = new Matchup(self.movie.data.selectedMatchup);
			var data = {root: true, name: "Scoring Breakdown", children: []};

			matchup.getTeams().forEach(function(team)
			{
				var activePlayers = team.getActivePlayers().toPlayerCollection();
				var slots = activePlayers.getSlots();

				var teamData = {
					name: team.getTeamName(),
					activePlayers: activePlayers,
					children: []
				};

				slots.forEach(function(slot)
				{
					activePlayers.filter(function(player)
					{
						return player.getSlot() == slot;
					});

					var score = activePlayers.getPointsScored();

					if (score > 0)
					{
						teamData.children.push({
							name: slot,
							size: score
						});
					}

					activePlayers.filter(null);
				});

				data.children.push(teamData);
			});

			return data;
		}

	})(window, "PosScoringCircles");
});