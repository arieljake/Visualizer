

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Metadata.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
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
						d3.select(this).select("text.weekLabel").attr("fill","#5D6938");
						d3.select(this).select("text.weekNo").attr("fill","#00F");
					})
					.on("mouseout",function(d,i)
					{
						d3.select(this).select("rect").attr("fill","#EEE");
						d3.select(this).select("text.weekLabel").attr("fill","#999");
						d3.select(this).select("text.weekNo").attr("fill","#000");
					})
					.on("click",function(d,i)
					{
						var selectedWeek = d;
						self.emit("end",selectedWeek);
					});

				self.weekGroups.append("rect")
					.attr("fill","#EEE")
					.attr("stroke","#999")
					.attr("width",90)
					.attr("height",90)
					.attr("rx",5);

				self.weekGroups.append("text")
					.classed("weekNo",1)
					.text(function(d,i)
					{
						return d;
					})
					.attr("fill","#000")
					.attr("font-size","40pt")
					.attr("x",44)
					.attr("y",67);

				self.weekGroups.append("text")
					.classed("weekLabel",1)
					.text(function(d,i)
					{
						return "Week";
					})
					.attr("fill","#999")
					.attr("font-size","14pt")
					.attr("x",13)
					.attr("y",30);
			});
		}

	})(window, "WeekSelection");
});