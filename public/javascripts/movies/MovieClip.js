

define(RequireImports.new()
	.toArray(),function()
{
	(function (context, sceneName)
	{
		var movieClip = context[sceneName] = function ()
		{

		};

		movieClip.prototype.getDuration = function(suggested)
		{
			if (!this.movie.curSceneInDev || this.movie.curSceneInDev == this.name)
			{
				return suggested;
			}
			else
			{
				return 1;
			}
		};

		movieClip.prototype.writeTranslate = function(x,y)
		{
			return "translate(" + x + "," + y + ")";
		};

	})(window,"MovieClip");
});
