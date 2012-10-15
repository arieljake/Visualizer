var name = "log-console";

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

    console.log(payload.toString("utf-8"));

    worker.log("completed!");
    work.end(payload);
});