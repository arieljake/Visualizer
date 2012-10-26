

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
			this.constants = {};
			this.constants.delayOut = 1750;
			this.constants.delayIn = 350;
			this.constants.rectX = 30;
			this.constants.rectY = 30;
			this.constants.rectW = 200;
			this.constants.rectH = 75;
			this.constants.rectDist = (2*this.constants.rectW) + (2*this.constants.rectH)
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;
			var rectX = this.constants.rectX;
			var rectY = this.constants.rectY;

			if (self.movie.eliminateTransitionsFor(this))
			{
				cb();
				return;
			}

			self.vis = self.createVis()
				.attr("opacity",0)
				.attr("transform",self.writeTranslate(rectX,rectY));

			self.vis.append("rect")
				.style("stroke-width",3)
				.style("stroke","#00F")
				.style("fill","none")
				.attr("width",this.constants.rectW)
				.attr("height",this.constants.rectH)
				.style("stroke-dasharray","" + (this.constants.rectDist/40) + "," + (this.constants.rectDist/40))
				.style("stroke-dashoffset",0);

			self.vis.append("text")
				.text("press spacebar")
				.attr("font-size","16pt")
				.attr("fill","#00F")
				.attr("transform",self.writeTranslate(30,20));

			self.vis.append("text")
				.text("or click anywhere")
				.attr("font-size","16pt")
				.attr("fill","#00F")
				.attr("transform",self.writeTranslate(15,42));

			self.vis.append("text")
				.text("to continue")
				.attr("font-size","16pt")
				.attr("fill","#00F")
				.attr("transform",self.writeTranslate(45,65));

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

					if (cb)
						cb();
				}
			};

			$(document).bind("keypress", keypressHandler);
			$(document).bind("click", keypressHandler);
		}

		scene.prototype.fadeOut = function(cb)
		{
			var self = this;

			self.vis.transition()
				.duration(self.constants.delayOut)
				.attr("opacity",0)
				.each("end",self.transitionCB(function()
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
				.each("end",self.transitionCB(function()
			{
				if (cb)
					cb();
				else
					self.fadeOut();
			}))
		}

	})(window, "PressSpacebarToContinue");
});