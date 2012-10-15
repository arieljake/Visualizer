
var Worker = require("../../node-lib/gearman/Worker.js");
var ActionSequence = require("../../node-lib/control/ActionSequence.js");
var HTTPService = require("../../node-lib/datasources/HTTPService.js");

var CategoryGroups = function()
{
	this.worker = new Worker("CategoryGroups");
	this.worker.registerWorker("getCategoryGroups", this.get);
};

CategoryGroups.prototype.get = function(payload,work)
{
	new ActionSequence()
		.thenDo(function(cb)
		{
			(new HTTPService()).get("http://localhost:3003/values/categoryGroups", function(data)
			{
				cb(JSON.parse(data.toString("utf8")));
			});
		})
		.thenDo(function(cb,categoryGroups)
		{
			var pieData = {name: "Category Groups", children: []};

			categoryGroups.forEach(function(group)
			{
				pieData.children.push({
					name: group.name,
					size: group.categories.length
				});
			});

			work.end(pieData);

			cb();
		})
		.activate();
};

if (this["module"] !== undefined)
	module.exports = CategoryGroups;