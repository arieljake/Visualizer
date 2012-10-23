

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/control", ["Command.js","CommandSequence.js"])
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
			var team1Slots = team1ActivePlayers.getSlots();
			var slotOrdering = self.movie.constants.positionOrder;

			self.data = _.sortBy(team1Slots,function(d) { return slotOrdering.indexOf(d.slot); });
			self.movie.data.positions = self.data;
			self.vis = self.createVis();

			var commands = [];
			commands.push(new Command(self.createAgendaGroups,null,self));

			var sequence = new CommandSequence(commands);
			sequence.execute(null,cb);
		};

		scene.prototype.createAgendaGroups = function(params,cb)
		{
			var self = this;

			self.agendaGroups = self.vis.selectAll("g.positionAgendaItem").data(self.data).enter().append("g")
				.classed("positionAgendaItem",1)
				.attr("opacity",0);

			self.agendaGroups.append("rect")
				.attr("width",10)
				.attr("height",10)
				.attr("fill","#EFEFEF")
				.attr("y",2);

			self.agendaGroups.append("text")
				.text(function(d,i)
				{
					return d;
				})
				.attr("fill","#666")
				.attr("font-size","12pt")
				.attr("x",18)
				.attr("y",13);

			self.agendaGroups
				.transition()
				.duration(self.getDuration(1500))
				.attr("opacity",1)
				.attr("transform",function(d,i)
				{
					return self.writeTranslate(0,30 + (20*i));
				})
				.each("end", self.transitionCB(cb));
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
				.duration(self.getDuration(500))
				.attr("fill", function(d,i)
				{
					if (d == position)
						return self.movie.constants.positionRed;
					else
						return "#EFEFEF";
				})
				.each("end",self.transitionCB(cb));
		};

	})(window, "PositionsAgenda");
});