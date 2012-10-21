

define(RequireImports.new()
	.add("/js-lib/js/control", ["Command.js"])
	.add("/js-lib/js/external/creationix",["EventEmitter.js"])
	.toArray(),function()
{
	(function (context, sceneName)
	{
		var movieClip = context[sceneName] = function (groupClassName)
		{
			this.groupClassName = groupClassName || sceneName;
			this.posX = 0;
			this.posY = 0;
		};

		movieClip.prototype = new EventEmitter();

		movieClip.prototype.toString = function()
		{
			return sceneName;
		}

		// CONFIG FUNCTIONS

		movieClip.prototype.setPosition = function(x,y)
		{
			this.posX = x;
			this.posY = y;

			return this;
		};

		movieClip.prototype.setVisParent = function(parent)
		{
			this.visParent = parent;

			return this;
		}

		// END CONFIG FUNCTIONS

		movieClip.prototype.createVis = function()
		{
			var parent = this.visParent || this.movie.vis;

			return parent.append("g").classed(this.groupClassName,1)
				.attr("transform",this.writeTranslate(this.posX,this.posY));
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
