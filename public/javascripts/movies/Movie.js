


var Movie = function()
{

};

Movie.prototype.start = function()
{
	window.curMovie = this;

	var self = this;
	self.data = {};

	self.scenes = _.map(self.sceneNames, function(sceneName)
	{
		var sceneType = window[sceneName];
		var scene = new sceneType(self);

		return scene;
	});

	self.vis = this.parent.append("svg:svg")
		.classed("movie",1)
		.attr("width", this.w)
		.attr("height", this.h);

	var sequence = new CommandSequence(self.scenes.concat());
	sequence.execute();
};

Movie.prototype.getXFn = function(selector)
{
	return this.getPositionFn(selector,"x");
};

Movie.prototype.getYFn = function(selector)
{
	return this.getPositionFn(selector,"y");
};

Movie.prototype.getPositionFn = function(selector,attr)
{
	var self = this;
	var positions = this.getPositionsOf(selector);

	return (function(posArray,field)
	{
		return function(d,i)
		{
			return posArray[i][field];
		};
	})(positions,attr);
};

Movie.prototype.getPositionsOf = function(selector)
{
	var self = this;
	var items = typeof selector == "string" ? this.vis.selectAll(selector) : selector;
	var positions = [];

	items.each(function(d,i)
	{
		positions.push({
			x: self.getX(this),
			y: self.getY(this)
		});
	});

	return positions;
};

Movie.prototype.getX = function(obj)
{
	obj = d3.select(obj);

	if (obj.length == 0)
		return 0;

	var objType = obj[0][0].toString();

	if (objType.indexOf("SVGGElement") > 0)
	{
		return obj.attr("transform") ? parseFloat(obj.attr("transform").replace("translate(","").split(",").shift()) : 0;
	}
	else
	{
		return parseFloat(obj.attr("x")) ? parseFloat(obj.attr("x")) : 0;
	}
};

Movie.prototype.getY = function(obj)
{
	obj = d3.select(obj);

	if (obj.length == 0)
		return 0;

	var objType = obj[0][0].toString();

	if (objType.indexOf("SVGGElement") > 0)
	{
		return obj.attr("transform") ? parseFloat(obj.attr("transform").replace("translate(","").split(",").pop()) : 0;
	}
	else
	{
		return parseFloat(obj.attr("x")) ? parseFloat(obj.attr("y")) : 0;
	}
};