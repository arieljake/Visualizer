

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Teams.js"])
	.add("/js-lib/js/logging",["Log.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,matchupParams)
		{
			this.movie = movie;
			this.matchupParams = matchupParams;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Teams.get(null,function(err,teams)
			{
				self.data = teams;
				self.vis = self.createVis();

				self.vis.append("text")
					.classed("prompt",1)
					.text("Which team do you want to view?")
					.attr("x",50)
					.attr("y",40)
					.attr("font-size","18pt");

				self.teamGroups = self.vis.selectAll("g.team").data(self.data).enter().append("g")
					.classed("team",1)
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(self.movie.width + 100,70 + (40*(i%3)));
					});

				self.teamGroups.append("image")
					.attr("xlink:href",function(d,i)
					{
						return "/images/teams/" + d.id + ".png";
					})
					.attr("width","35px")
					.attr("height","35px");

				self.teamGroups.append("text")
					.text(function(d,i)
					{
						return d.name;
					})
					.attr("font-size","9pt")
					.attr("y",15)
					.attr("x",40);

				self.teamGroups.transition()
					.duration(self.getDuration(1500))
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(50 + (75*i),self.utils.getPosition(this).y);
					})
					.each("end",self.transitionCB(function()
				{
					self.teamGroups.on("click",function(team,i)
					{
						self.vis.select("text.prompt").remove();

						self.teamGroups.filter(function(d,i)
						{
							return d.id != team.id;
						}).transition()
							.duration(1500)
							.attr("opacity",0);

						var selectedTeamGroup = self.teamGroups.filter(function(d,i)
						{
							return d.id == team.id;
						});

						selectedTeamGroup.transition()
							.duration(1500)
							.attr("transform",self.writeTranslate(10,self.movie.constants.lowerSectionY + 10))
							.each("end",self.transitionCB(function()
						{
							selectedTeamGroup.select("text")
								.attr("fill","#FFF");
						}));
					})
				}))
			});
		}

	})(window, "TeamSelection");
});