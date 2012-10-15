var name = "format-neo4j-results";

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);
worker.registerWorker(name,function(payload, work)
{
    if(!payload)
    {
        worker.log("no payload");
        work.error();
        return;
    }

    worker.log("starting");

    var input = JSON.parse(payload.toString("utf-8"));
    var output = JSON.stringify(input[0].ofType._data);

    worker.log("complete");

    work.end(output);
});