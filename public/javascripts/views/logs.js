
$("body").append('<div id="logs"></div>');

require(RequireImports.new()
	.add("/javascripts/movies/Logs", ["movie.js"])
	.toArray(), function()
{
	if (window.curMovie == undefined)
	{
		window.curMovie = new LogsMovie("#logs");
		window.curMovie.play();
	}
});