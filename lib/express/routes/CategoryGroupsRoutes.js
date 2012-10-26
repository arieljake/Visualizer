
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
				(new HTTPService({
					baseUrl: "http://localhost:3000/"
				})).get("values/categoryGroups", function(data)
				{
					if (data)
						cb(JSON.parse(data.toString("utf8")));
					else
						cb(data);
				});
			})
			.thenDo(function(cb,categoryGroups)
			{
				var pieData = {name: "Category Groups", children: []};

				if (categoryGroups)
				{
					categoryGroups.forEach(function(group)
					{
						pieData.children.push({
							name: group.name,
							size: group.categories.length
						});
					});
				}

				res.send(pieData);
			})
			.activate();
	});
};

if (module)
	module.exports = CategoryGroups;