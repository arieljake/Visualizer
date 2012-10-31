

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
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

			$.get("/user/profile/yahoo", function(data)
			{
				if (_.isObject(data) && data.hasOwnProperty("profileUrl"))
				{
					cb();
				}
				else
				{
					window.location.href = "/auth?authRedirectUrl=/m/episode2";
				}
			})
		}

	})(window, "AuthorizeYahoo");
});