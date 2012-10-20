

$(document).ready(function()
{
	$("body").append('<div id="movie"></div>');

	require(RequireImports.new()
		.add("/javascripts/movies/MatchupComparison",["movie.js"])
		.toArray(), function()
	{
		var movie = new MatchupComparison("#movie");
		movie.start();
	});
});