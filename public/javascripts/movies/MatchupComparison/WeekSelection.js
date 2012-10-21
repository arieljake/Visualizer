

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Metadata.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie)
		{
			this.movie = movie;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Metadata.getWeeks(null,function(err,weeks)
			{
				self.data = weeks;
				self.vis = self.createVis();

				self.title = self.vis.append("text").text("Which week do you want to review?");
				self.weekGroups = self.vis.selectAll("g.week").data(self.data).enter().append("g").classed("week",1);

				self.weekGroups
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(100*i,10);
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
						var selectedWeek = d;
						self.emit("end",selectedWeek);
					});

				self.weekGroups.append("rect")
					.attr("fill","#EEE")
					.attr("stroke","#000")
					.attr("width",90)
					.attr("height",90);

				self.weekGroups.append("text")
					.text(function(d,i)
					{
						return d;
					})
					.attr("fill","#CCC")
					.attr("font-size","40pt")
					.attr("x",30)
					.attr("y",60);

				self.weekGroups.append("text")
					.text(function(d,i)
					{
						return "Week";
					})
					.attr("x",25)
					.attr("y",35);
			});
		}

	})(window, "WeekSelection");
});