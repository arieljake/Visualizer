

define(RequireImports.new()
	.add("/js-lib/js/control", ["Command.js"])
	.add("/js-lib/js/external/creationix",["EventEmitter.js"])
	.toArray(),function()
{
	(function (context, sceneName)
	{
		var movieClip = context[sceneName] = function (groupClassName)
		{
			this.groupClassName = groupClassName;
		};

		movieClip.prototype = new EventEmitter();

		movieClip.prototype.createVis = function()
		{
			return this.movie.vis.append("g").classed(this.groupClassName,1);
		};

		movieClip.prototype.getRemoveCommand = function()
		{
			var self = this;

			return new Command(self.remove,null,self);
		};

		movieClip.prototype.remove = function(params,cb)
		{
			this.movie.vis.selectAll("g." + this.groupClassName).remove();

			cb();
		};

		movieClip.prototype.execute = function(params,cb)
		{

		};

		movieClip.prototype.getDuration = function(suggested)
		{
			if (!this.movie.curSceneInDev || this.movie.curSceneInDev == this.name)
			{
				return suggested;
			}
			else
			{
				return 1;
			}
		};

		movieClip.prototype.writeTranslate = function(x,y)
		{
			return "translate(" + x + "," + y + ")";
		};

		movieClip.prototype.callIn = function(fnName,timeout,cb,params)
		{
			var self = this;

			setTimeout(function()
			{
				self[fnName](params,cb);
			},timeout);
		}

	})(window,"MovieClip");
});
