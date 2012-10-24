
define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/Logs", ["Viewer.js"])
	.toArray(), function ()
{
	(function (context, movieName)
	{
		var movie = context[movieName] = function (parentSelector)
		{
			var startupParams = {
				name: movieName,
				parentSelector: parentSelector,
				constants: {
				},
				curSceneInDev: null // null // "WeekSelection"
			};

			Movie.call(this,startupParams);
		};

		movie.prototype = new Movie();

		movie.prototype.getSceneFunctions = function()
		{
			var self = this;

			return [

				(new Viewer(self))
			];
		};

	})(window, "LogsMovie");
});