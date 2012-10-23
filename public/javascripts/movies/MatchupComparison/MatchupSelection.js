

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Matchups.js"])
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

			Matchups.get(self.matchupParams,function(err,matchups)
			{
				self.data = matchups;
				self.vis = self.createVis();

				self.vis.append("text")
					.text("Menlo Park OG's Keeper League")
					.attr("font-weight","bold");

				self.vis.append("text")
					.text("Which week " + self.matchupParams.weekNo + " matchup do you want to review?")
					.attr("transform",self.writeTranslate(0,20));

				self.matchupGroups = self.vis.selectAll("g.matchup").data(self.data).enter().append("g")
					.classed("matchup",1)
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(0,50 + (65*i));
					})
					.on("mouseover",function(d,i)
					{
						d3.select(this).select("rect").attr("fill",self.movie.constants.yellowHi);
					})
					.on("mouseout",function(d,i)
					{
						d3.select(this).select("rect").attr("fill","#FFF");
					})
					.on("click",function(d,i)
					{
						var selectedMatchup = d;
						Log.log("matchup selected: " + selectedMatchup.matchupId);
						self.emit("end",selectedMatchup);
					});

				self.matchupGroups.append("rect")
					.attr("width",450)
					.attr("height",70)
					.attr("y",1)
					.attr("fill","#FFF");

				self.matchupGroups.append("path")
					.attr("d","M 0 65 L 450 65 z")
					.attr("stroke","#666");

				self.matchupGroups.append("image")
					.attr("xlink:href",function(d)
					{
						return "/images/teams/" + d.teams[0].id + ".png";
					})
					.attr("width",45)
					.attr("height",45)
					.attr("x",10)
					.attr("y",10);

				self.matchupGroups.append("text")
					.classed("teamName",1)
					.text(function(d,i)
					{
						return d.teams[0].name;
					})
					.attr("fill","#000")
					.attr("font-size","10pt")
					.attr("x",65)
					.attr("y",25);

				self.matchupGroups.append("text")
					.text(function(d,i)
					{
						return "vs";
					})
					.attr("fill","#000")
					.attr("font-size","11pt")
					.attr("x",215)
					.attr("y",45);

				self.matchupGroups.append("image")
					.attr("xlink:href",function(d)
					{
						return "/images/teams/" + d.teams[1].id + ".png";
					})
					.attr("width",45)
					.attr("height",45)
					.attr("x",245)
					.attr("y",10);

				self.matchupGroups.append("text")
					.classed("teamName",1)
					.text(function(d,i)
					{
						return d.teams[1].name;
					})
					.attr("fill","#000")
					.attr("font-size","10pt")
					.attr("x",300)
					.attr("y",25);
			});
		}

	})(window, "MatchupSelection");
});