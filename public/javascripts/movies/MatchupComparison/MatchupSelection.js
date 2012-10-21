

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Matchups.js"])
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

				self.title = self.vis.append("text").text("Which matchup do you want to review?");
				self.matchupGroups = self.vis.selectAll("g.matchup").data(self.data).enter().append("g").classed("matchup",1);

				self.matchupGroups
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(200 * (Math.floor(i/3)),10 + (70*(i%3)));
					})
					.on("mouseover",function(d,i)
					{
						d3.select(this).select("rect").attr("fill","#FFC");
					})
					.on("mouseout",function(d,i)
					{
						d3.select(this).select("rect").attr("fill","#EEE");
					})
					.on("click",function(d,i)
					{
						var selectedMatchup = d;
						self.emit("end",selectedMatchup);
					});

				self.matchupGroups.append("rect")
					.attr("fill","#EEE")
					.attr("stroke","#000")
					.attr("width",165)
					.attr("height",60);

				self.matchupGroups.append("text")
					.text(function(d,i)
					{
						return d.teams[0].name;
					})
					.attr("x",10)
					.attr("y",20);

				self.matchupGroups.append("text")
					.text(function(d,i)
					{
						return "vs";
					})
					.attr("x",10)
					.attr("y",35);

				self.matchupGroups.append("text")
					.text(function(d,i)
					{
						return d.teams[1].name;
					})
					.attr("x",10)
					.attr("y",50);
			});
		}

	})(window, "MatchupSelection");
});