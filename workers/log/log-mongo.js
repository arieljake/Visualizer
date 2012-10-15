var name = "log-mongo";

var mongo = require("mongoskin");
var mongoLogger = mongo.db('localhost:27017/gearman').collection('log');

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

    var msg = JSON.parse(payload.toString("utf-8"));

    worker.log("starting");

    mongoLogger.insert(msg,function(err,result)
    {
        if (err)
        {
            console.log(name + " error");
            console.log(name + " msg: " + msg);
            console.log(name + " error: " + err);
        }
    });

    worker.log("completed!");
    work.end(payload);
});