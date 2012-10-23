
$("body").append('<div id="movie"></div>');

require(RequireImports.new()
	.add("/javascripts/movies/MatchupComparison",["movie.js"])
	.toArray(), function()
{
	if (window.curMovie == undefined)
	{
		window.curMovie = new MatchupComparison("#movie");
		window.curMovie.play();
	}
});