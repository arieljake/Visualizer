

define(RequireImports.new()
	.add("/javascripts/movies/",["MovieClip.js"])
	.toArray(),function()
{
	(function (context, varName)
	{
		var scene = context[varName] = function (movie,parent)
		{
			this.movie = movie;
			this.parent = parent;
			this.constants = {
				delayOut: 1750,
				delayIn: 350
			};
		};

		scene.prototype = new MovieClip("PressSpacebarToContinue");

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			self.vis = self.parent.append("g").classed("pressSpacebarToContinue",1)
				.attr("opacity",0);

			var rectX = params && params.x ? params.x : 0;
			var rectY = params && params.y ? params.y : 0;
			var rectW = 200;
			var rectH = 75;
			var rectDist = (2*rectW) + (2*rectH);

			self.vis.append("rect")
				.style("stroke-width",3)
				.style("stroke","#00F")
				.style("fill","none")
				.attr("width",rectW)
				.attr("height",rectH)
				.attr("transform",self.writeTranslate(rectX,rectY))
				.style("stroke-dasharray","" + (rectDist/40) + "," + (rectDist/40))
				.style("stroke-dashoffset",0);

			self.vis.append("text")
				.text("press spacebar")
				.attr("font-size","16pt")
				.attr("fill","#00F")
				.attr("transform",self.writeTranslate(rectX + 30,rectY + 30));

			self.vis.append("text")
				.text("to continue")
				.attr("font-size","16pt")
				.attr("fill","#00F")
				.attr("transform",self.writeTranslate(rectX + 45,rectY + 55));

			self.fadeIn();
			self.monitorForSpacebar(cb);
		};

		scene.prototype.monitorForSpacebar = function(cb)
		{
			var self = this;

			var keypressHandler = function(e)
			{
				if (!e.keyCode || e.keyCode == 32)
				{
					e.preventDefault();
					e.stopImmediatePropagation();

					self.vis.remove();
					$(document).unbind("keypress", keypressHandler);
					$(document).unbind("click", keypressHandler);
					$(document).unbind("tap", keypressHandler);

					if (cb)
						cb();
				}
			};

			$(document).bind("keypress", keypressHandler);
			$(document).bind("click", keypressHandler);
			$(document).bind("tap", keypressHandler);
		}

		scene.prototype.fadeOut = function(cb)
		{
			var self = this;

			self.vis.transition()
				.duration(self.constants.delayOut)
				.attr("opacity",0)
				.each("end",Transitions.cb(function()
			{
				if (cb)
					cb();
				else
					self.fadeIn();
			}))
		}

		scene.prototype.fadeIn = function(cb)
		{
			var self = this;

			self.vis.transition()
				.duration(self.constants.delayIn)
				.attr("opacity",1)
				.each("end",Transitions.cb(function()
			{
				if (cb)
					cb();
				else
					self.fadeOut();
			}))
		}

	})(window, "PressSpacebarToContinue");
});