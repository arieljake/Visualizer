
var ActionSequence = require("../../node-lib/control/ActionSequence.js");
var HTTPService = require("../../node-lib/datasources/HTTPService.js");

var CategoryGroups = function()
{

};

CategoryGroups.prototype.attachToApp = function(app)
{
	var self = this;

	app.get("/categoryGroups", function(req,res)
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

				res.send(pieData);
			})
			.activate();
	});
};

if (module)
	module.exports = CategoryGroups;