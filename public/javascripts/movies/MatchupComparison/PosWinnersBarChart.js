

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Teams.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,matchup)
		{
			this.movie = movie;
			this.matchup = matchup;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			var comparisonKeys = _.filter(_.keys(self.movie.data),function(key)
			{
				return key.indexOf("comparison") == 0;
			});

			var comparisons = _.map(comparisonKeys,function(key)
			{
				return self.movie.data[key];
			});

			var comparisonsOfInterest = _.filter(comparisons,function(comp)
			{
				return comp.actual.diff > 3;
			});

			comparisonsOfInterest = _.sortBy(comparisonsOfInterest, function(comp)
			{
				return self.movie.constants.positionOrder.indexOf(comp.position);
			});

			self.vis = self.createVis();

			self.vis.append("text")
				.text("Winner")
				.attr("font-size","14pt")
				.attr("opacity",0)
				.transition()
				.duration(self.getDuration(1000))
				.attr("opacity",1);

//			self.vis.append("path")
//				.attr("d","M 0 0 L " + (200*comparisonsOfInterest.length) + " 0 z")
//				.attr("stroke","#000");

			var barGroups = self.vis.selectAll("g.winnerBar").data(comparisonsOfInterest).enter().append("g").classed("winnerBar",1)
				.attr("transform",function(d,i)
				{
					return self.writeTranslate(200*i,200);
				});

			barGroups.append("text")
				.text(function(d,i){ return d.position; })
				.attr("x",100);
		}

	})(window, "PosWinnersBarChart");
});