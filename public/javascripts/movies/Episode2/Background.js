

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
			this.constants = {
				dividerTop: movie.constants.lowerSectionY - 10 + "px",
				dividerHeight: "10px",
				lowerDivTop: movie.constants.lowerSectionY + "px"
			}
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			$("html, body")
				.css("width","100%")
				.css("minHeight",self.movie.height);

			$("<div id='background'></div>")
				.prependTo("body")
				.css("width","100%")
				.css("height","100%")
				.hide();

			$("<div id='divider'></div>")
				.appendTo("#background")
				.css("height",self.constants.dividerHeight)
				.css("width","100%")
				.css("background-color","#D8D8D7")
				.css("position","absolute")
				.css("top",self.constants.dividerTop);

			$("<div id='lowerSection'></div>")
				.appendTo("#background")
				.css("height","100%")
				.css("width","100%")
				.css("background-color","#1C6485")
				.css("position","absolute")
				.css("top",self.constants.lowerDivTop);

			$("#background, #movie")
				.css("position","absolute")
				.css("top",0);

			$("#background").fadeIn(self.getDuration(1000),cb);
		}

	})(window, "Background");
});