
define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/Episode2", ["AuthorizeYahoo.js","EpisodeIntro.js","LeagueTitle.js","TeamSelection.js","Episode1Control.js"])
	.toArray(), function ()
{
	(function (context, movieName)
	{
		var movie = context[movieName] = function (parentSelector)
		{
			var startupParams = {
				name: movieName,
				parentSelector: parentSelector,
				width: 1024,
				height: 768,
				databases: {

				},
				constants: {
					lowerSectionY: 300
				},
				curSceneInDev: null // "TeamSelection" // null // "WeekSelection"
			};

			Movie.call(this,startupParams);
		};

		movie.prototype = new Movie();

		movie.prototype.getSceneFunctions = function()
		{
			var self = this;

			return [

				(new AuthorizeYahoo(self)),
				(new EpisodeIntro(self,2)),
				(new Episode1Control(self))
			];
		};

	})(window, "Episode2");
});