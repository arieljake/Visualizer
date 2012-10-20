

$(document).ready(function()
{
	$("body").append('<div id="movie"></div>');

	require(RequireImports.new()
		.add("/javascripts/movies/AverageMovie",["movie.js"])
		.toArray(), function()
	{
		var movie = new AverageMovie("#movie");
		movie.start();
	});
});