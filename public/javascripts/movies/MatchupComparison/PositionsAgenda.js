

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/control", ["Command.js","CommandSequence.js"])
	.add("/js-lib/js/graphs",["Transitions.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie,matchup)
		{
			this.movie = movie;
			this.matchup = matchup;
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			var matchup = new Matchup(self.matchup);
			var team1ActivePlayers = matchup.getTeam1().getActivePlayers().toPlayerCollection();
			var team1Positions = team1ActivePlayers.getPositions();
			var positionOrdering = ["QB","WR","RB","TE","W/R","K","DEF"];

			self.data = _.sortBy(team1Positions,function(d) { return positionOrdering.indexOf(d.position); });
			self.vis = self.createVis();

			var commands = [];
			commands.push(new Command(self.createAgendaGroups,null,self));

			var sequence = new CommandSequence(commands);
			sequence.execute(null,cb);
		};

		scene.prototype.createAgendaGroups = function(params,cb)
		{
			var self = this;

			self.agendaGroups = self.vis.selectAll("g.positionAgendaItem").data(self.data).enter().append("g").classed("positionAgendaItem",1);

			self.agendaGroups
				.attr("opacity",0);

			self.agendaGroups.append("rect")
				.attr("width",50)
				.attr("height",50)
				.attr("stroke","#000")
				.attr("fill","#FFF");

			self.agendaGroups.append("text")
				.text(function(d,i)
				{
					return d;
				})
				.attr("fill","#000")
				.attr("font-size","14pt")
				.attr("x",5)
				.attr("y",25);

			self.agendaGroups
				.transition()
				.duration(1500)
				.attr("opacity",1)
				.attr("transform",function(d,i)
				{
					return self.writeTranslate(60*i,0);
				})
				.each("end", Transitions.cb(cb));
		};

		scene.prototype.getPositions = function()
		{
			return this.data;
		};

		scene.prototype.setActivePosition = function(position,cb)
		{
			var self = this;

			self.agendaGroups.selectAll("rect")
				.transition()
				.duration(500)
				.attr("fill",function(d,i)
				{
					if (d == position)
						return "#EEE";
					else
						return "#FFF";
				})
				.each("end",Transitions.cb(cb));
		};

	})(window, "PositionsAgenda");
});