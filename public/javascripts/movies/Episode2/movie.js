
define(RequireImports.new()
	.add("/js-lib/js/movies", ["Movie.js"])
	.add("/javascripts/movies/Episode2", ["LeagueTitle.js","EpisodeIntro.js","Background.js","TeamSelection.js"])
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
					lowerSectionY: 210
				},
				curSceneInDev: "TeamSelection" // null // "WeekSelection"
			};

			Movie.call(this,startupParams);
		};

		movie.prototype = new Movie();

		movie.prototype.getSceneFunctions = function()
		{
			var self = this;

			return [

				(new EpisodeIntro(self,2)),
				(new LeagueTitle(self)),
				(new TeamSelection(self))
			];
		};

	})(window, "Episode2");
});