

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

				var mouseoverStyle = function(elem)
				{
					elem = _.isObject(elem) ? elem : this;

					d3.select(elem).select("rect").attr("fill",self.movie.constants.yellowHi);
					d3.select(elem).select("rect").attr("stroke",self.movie.constants.weekBlue);
					d3.select(elem).select("text.weekLabel").attr("fill",self.movie.constants.weekLightBlue);
					d3.select(elem).select("text.weekNo").attr("fill",self.movie.constants.weekBlue);
				}

				var mouseoutStyle = function(elem)
				{
					elem = _.isObject(elem) ? elem : this;

					d3.select(elem).select("rect").attr("fill",self.movie.constants.yellowHiGrayed);
					d3.select(elem).select("rect").attr("stroke",self.movie.constants.weekBlueGrayed);
					d3.select(elem).select("text.weekLabel").attr("fill",self.movie.constants.weekLightBlueGrayed);
					d3.select(elem).select("text.weekNo").attr("fill",self.movie.constants.weekBlueGrayed);
				}

				self.weekGroups
					.attr("transform",function(d,i)
					{
						return self.writeTranslate(100*i,10);
					})
					.on("mouseover",function(d,i)
					{
						mouseoverStyle(this);
					})
					.on("mouseout",function(d,i)
					{
						mouseoutStyle(this);
					})
					.on("click",function(d,i)
					{
						var selectedWeek = d;
						self.emit("end",selectedWeek);
					});

				self.weekGroups.append("rect")
					.attr("width",90)
					.attr("height",90)
					.attr("rx",5);

				self.weekGroups.append("text")
					.classed("weekNo",1)
					.text(function(d,i)
					{
						return d;
					})
					.attr("font-size","40pt")
					.attr("x",44)
					.attr("y",67);

				self.weekGroups.append("text")
					.classed("weekLabel",1)
					.text(function(d,i)
					{
						return "Week";
					})
					.attr("font-size","14pt")
					.attr("x",13)
					.attr("y",30);

				self.weekGroups.each(mouseoutStyle);
			});
		}

	})(window, "WeekSelection");
});