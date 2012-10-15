

define(RequireImports.new()
	.add("/js-lib/js/yahoo/20datasets/",["Teams.js"])
	.add("/javascripts/movies/",["MovieClip.js"])
	.add("/javascripts/movies/AverageMovie/",["ShowTeamRankings.js"])
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

			Teams.get(null,function(err,teams)
			{
				var movie = self.movie;

				movie.data.teams = _.sortBy(teams,function(team) { return team.name.toLowerCase(); });
				movie.teamGroup = movie.vis.selectAll("g.teams").data([movie.data.teams]).enter().append("g").classed("teams",1);
				movie.teamGroups = movie.teamGroup.selectAll("g.team").data(movie.data.teams).enter().append("g").classed("team",1);

				movie.teamBkgds = movie.teamGroups.append("rect")
					.classed("teamBkgd",1)
					.attr("x",0)
					.attr("y",0)
					.attr("width",50)
					.attr("height",50)
					.attr("fill",movie.constants.teamRed)
					.style("stroke","black");

				movie.teamLabels = movie.teamGroups.append("text")
					.classed("name",1)
					.attr("x",function(d,i){ return 70; })
					.attr("y",function(d,i){ return 22; })
					.attr("font-size",24)
					.text(function(d,i){ return d.name; });

				movie.teamGroups.transition()
					.duration(self.getDuration(1500))
					.attr("transform",function(d,i)
					{
						var x = 20;
						var y = 30 + (60 * (i+1));
						var transform = "translate(" + x + "," + y + ")";

						return transform;
					});

				movie.teamLabels.transition()
					.duration(self.getDuration(1500))
					.each("end",function()
					{
						var textGroup = movie.textGroup = movie.vis.selectAll("g.textGroup").data([{}]).enter()
							.append("g")
							.classed("textGroup",1)
							.attr("transform","translate(400,200)")
							.attr("opacity",0);

						movie.textGroup.append("text")
							.text("Menlo Park OG's Keeper League")
							.attr("x",0)
							.attr("y",0)
							.attr("font-size","60")
							.attr("fill",movie.constants.h1Fill);

						movie.textGroup.append("text")
							.text("12 teams on a mission")
							.attr("x",0)
							.attr("y",60)
							.attr("font-size","60")
							.attr("fill",movie.constants.h2Fill);

						movie.textGroup.transition()
							.duration(self.getDuration(1500))
							.attr("opacity",1)
							.each("end",Transitions.cb(function()
							{
								textGroup.append("text")
									.text("we know their rankings and records...")
									.attr("font-size","50")
									.attr("fill",movie.constants.h3Fill)
									.attr("x",0)
									.attr("y",160)
									.attr("opacity",0)
									.transition()
									.duration(self.getDuration(1500))
									.attr("opacity",1)
									.each("end",Transitions.cb(function()
									{
										var showTeamRankings = new ShowTeamRankings(self.movie);
										showTeamRankings.execute(null,function()
										{
											textGroup.append("text")
												.text("but is more there than meets the eye?")
												.attr("font-size","50")
												.attr("fill",movie.constants.h3Fill)
												.attr("x",0)
												.attr("y",205)
												.attr("opacity",0)
												.transition()
												.duration(self.getDuration(1500))
												.attr("opacity",1)
												.each("end",Transitions.cb(cb));
										})
									}));
							}));


							//.each("end",Transitions.callbackOnEnd(cb));
					});
			});
		}

	})(window, "Intro");
});