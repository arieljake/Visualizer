$(document).ready(function()
{
	$("body").append('<div id="main"></div>');
	$("body").append('<div id="sidebar"></div>');
	$("#sidebar").append('<ul id="uiElements"></ul>');

	require(RequireImports.new()
		.add("/js-lib/js/yahoo/80uiobjects",["uiLeagueDots.js","uiPointsBoxes.js","uiPointsTable.js"])
		.toArray(), function()
	{
		var uiElementList = [
			uiPointsTable,
			uiPointsBoxes,
			uiLeagueDots
		];

		var uiElementsMenu = $("<ul id='uiElementsMenu'></ul>").appendTo("#uiElements");
		uiElementList.forEach(function(uiElement,index)
		{
			uiElementsMenu.append("<li><a href='#" + index + "'>" + uiElement.getName() + "</a></li>");
		});
		uiElementsMenu.find("a").bind('click', function(e)
		{
			var elementIndex = $(e.target).attr('href').replace("#","");
			var uiElement = uiElementList[elementIndex];
			var elemContainerSelector= uiElement.getName();

			$("#main").children().remove();
			$("#main").append("<h3>" + uiElement.getName() + "</h3>");
			$("#main").append("<div id='" + elemContainerSelector + "'></div>");

			uiElement.load("#" + elemContainerSelector);
		});

		uiElementsMenu.find("a:last").trigger('click');
	});
});