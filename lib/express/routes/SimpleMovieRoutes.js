var util = require("util");
var _ = require("underscore");
var SimpleViewRenderRoute = require("../../node-lib/express/routes/SimpleViewRenderRoute.js");

var SimpleMovieRoutes = module.exports = function(params)
{
	params = params || {};
	params.template = "simpleMovieView";
	params.viewParamsGenerator = SimpleMovieRoutes.viewParamsGenerator;

	SimpleViewRenderRoute.call(this,params);
}

SimpleMovieRoutes.viewParamsGenerator = function(req,viewId)
{
	var movieFilename = "movie";

	if (req.query["episode"])
	{
		var episodeId = "episode-" + req.query["episode"];
		movieFilename = episodeId + "/movie";
	}

	movieFilename += ".js";

	return {
		params: {
			movieId: viewId,
			movieFilename: movieFilename
		}
	};
}

util.inherits(SimpleMovieRoutes,SimpleViewRenderRoute);
