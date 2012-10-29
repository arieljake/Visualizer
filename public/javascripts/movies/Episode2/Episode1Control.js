

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/10model",["Matchup.js"])
	.add("/js-lib/js/yahoo/20datasets",["Matchups.js"])
	.add("/javascripts/movies/Episode2",["PosScoringCircles.js"])
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
			var team = self.movie.data.selectedTeam;

			Matchups.getForTeam(team.id, function(err,matchups)
			{
				console.dir(matchups);
				self.data = new Matchup(matchups[0]);
				self.vis = self.createVis();
				self.weekControlGroup = self.vis.append("g").classed("weekControl",1);
				self.chartControlGroup = self.vis.append("g").classed("chartControl",1);
				self.chartGroup = self.vis.append("g").classed("charts3",1);

				self.createCharts();
				self.createWeekControl();
				self.createChartControl();

			});
		};

		scene.prototype.createCharts = function()
		{
			var self = this;
			var scoringCircles = new PosScoringCircles(self.movie).setVisParent(self.chartGroup).setPosition(0,30);
			scoringCircles.execute(matchupData,function()
			{

			});
		}

		scene.prototype.createWeekControl = function()
		{

		}

		scene.prototype.createChartControl = function()
		{

		}

	})(window, "Episode1Control");
});