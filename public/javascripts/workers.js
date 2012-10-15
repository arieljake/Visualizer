$(document).ready(function()
{
    $("#registerBtn").click(function(e)
    {
        var workerPath = $("#registerWorkerPath").val();

        if (workerPath.trim().length > 0)
        {
            registerWorker(workerPath);
        }
    });

    refreshWorkerList();
});

function registerWorker(path)
{
    $.post('/workers', {
        path: path
    }, function (data)
    {
        refreshWorkerList();
    });
}

function refreshWorkerList()
{
    $("a","#workerList").unbind('click', onRefreshLinkClick);

    $.get('/workers', function(data)
    {
        data.forEach(function (item)
        {
            var dl = $("<dl></dl>");
            dl.attr('id',item.id);
            dl.append("<dt>" + item.name + "</dt>");
            dl.append("<dd>" + prettyDate(new Date(item.lastStartedAt)) + "</dd>");
            dl.append("<dd>" + "<a>Refresh</a>" + "</dd>");
            dl.appendTo("#workerList");
        });

        $("#loading").hide();
        $("a","#workerList").bind('click', onRefreshLinkClick);
    });
}

function onRefreshLinkClick(e)
{
    var link = $(e.target);
    var itemId = link.parents("dl").attr('id');
    var action = link.text();

    switch (action)
    {
        case "Refresh":
            requestWorkerRefresh(itemId);
            break;
    }
}

function requestWorkerRefresh(itemId)
{
    $.post('/workers/' + itemId + '?action=refresh', function (data)
    {
        refreshWorkerList();
    });
}