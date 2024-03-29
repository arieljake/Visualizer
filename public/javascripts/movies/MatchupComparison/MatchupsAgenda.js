

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/control", ["Command.js","CommandSequence.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Matchups.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,matchupParams)
		{
			this.movie = movie;
			this.matchupParams = matchupParams;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Matchups.get(self.matchupParams,function(err,matchups)
			{
				self.data = matchups;
				self.vis = self.createVis();

				var commands = [];
				commands.push(new Command(self.createAgendaGroups,null,self));

				var sequence = new CommandSequence(commands);
				sequence.execute(null,cb);
			});
		};

		scene.prototype.createAgendaGroups = function(params,cb)
		{
			var self = this;

			self.agendaGroups = self.vis.selectAll("g.qbCompAgenda").data(self.data).enter().append("g").classed("qbCompAgenda",1);

			self.agendaGroups
				.attr("opacity",0)
				.attr("transform",function(d,i)
				{
					return self.writeTranslate(160*i,0);
				});

			self.agendaGroups.append("rect")
				.attr("width",150)
				.attr("height",75)
				.attr("stroke","#000")
				.attr("fill","none");

			self.agendaGroups.append("text")
				.text(function(d,i)
				{
					return "Matchup " + (i+1);
				})
				.attr("fill","#000")
				.attr("font-size","9pt")
				.attr("x",5)
				.attr("y",15);

			self.teamGroups = self.agendaGroups.selectAll("g.team").data(function(d,i) { return d.teams; }).enter().append("g").classed("team",1);

			self.teamGroups.append("text")
				.text(function(d,i)
				{
					return d.name;
				})
				.attr("fill","#000")
				.attr("font-size","10pt")
				.attr("x",5)
				.attr("y",function(d,i)
				{
					return 15 * (i+3);
				});

			self.agendaGroups
				.transition()
				.duration(1000)
				.delay(function(d,i)
				{
					return 50 * i;
				})
				.attr("opacity",.5)
 				.each("end",self.transitionCB(cb));
		};

		scene.prototype.getMatchup = function(matchupIndex)
		{
			return this.data[matchupIndex];
		};

		scene.prototype.setActiveMatchup = function(matchup,cb)
		{
			var self = this;

			self.agendaGroups
				.transition()
				.duration(500)
				.attr("opacity",function(d,i)
				{
					if (d.matchupId == matchup.matchupId)
						return 1;
					else
						return .5;
				})
				.each("end",self.transitionCB(cb));
		};

	})(window, "MatchupsAgenda");
});