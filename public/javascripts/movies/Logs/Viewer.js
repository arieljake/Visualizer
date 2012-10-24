

define(RequireImports.new()
	.add("/js-lib/js/movies",["MovieClip.js"])
	.add("/js-lib/js/yahoo/20datasets/",["Logs.js"])
	.toArray(),function()
{
	(function (varContext, varName)
	{
		var scene = varContext[varName] = function (movie)
		{
			this.movie = movie;
			this.constants = {
				pageSize: 40
			}
		};

		scene.prototype = new MovieClip(varName);

		scene.prototype.execute = function(params,cb)
		{
			var self = this;

			Logs.get(null,function(err,logs)
			{
				self.data = _.map(logs,function(log,index) { log.index = index; return log; });
				self.vis = self.createVis();
				self.logEntryList = self.vis.append("g").classed("logEntryList",1).attr("transform",self.writeTranslate(0,25));

				self.showPage(Math.ceil(self.data.length / self.constants.pageSize));
			});
		};

		scene.prototype.showPage = function(pageNo)
		{
			var self = this;
			var startLogIndex = (pageNo-1) * self.constants.pageSize;
			var logs = self.data.slice(startLogIndex,startLogIndex + self.constants.pageSize);

			self.showLogEntries(logs);
		};

		scene.prototype.showLogEntries = function(logEntries)
		{
			var self = this;

			var logEntries = self.logEntryList.selectAll("g.logEntry").data(logEntries).enter().append("g")
				.classed("logEntry",1)
				.attr("pageNo",function(d,i)
				{
					return d.index;
				})
				.attr("transform",function(d,i)
				{
					return self.writeTranslate(10,25*i);
				});

			logEntries.append("text")
				.text(function(d,i)
				{
					return d.index;
				});

			logEntries.append("text")
				.text(function(d,i)
				{
					return new Date(d.timestamp).toDateString();
				})
				.attr("x",20);

			logEntries.each(self.appendLogOutput)
		};

		scene.prototype.appendLogOutput = function(d,i)
		{
			if (d.entry.type == "log")
			{
				scene.prototype.appendLogType.call(this);
			}
		}

		scene.prototype.appendLogType = function()
		{
			var elem = d3.select(this);

			elem.append("text")
				.text(function(d,i)
				{
					return d.entry.data.msg;
				})
				.attr("x",150);
		}

	})(window, "Viewer");
});