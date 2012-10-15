var name = "dev-runNeo4J";

var context = {
    neo4jProcess: null,
    manualStop: false
};

var spawn = require('child_process').spawn;
var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);

worker.registerWorker("start-neo4j",function(payload, work)
{
    worker.log("starting");

    if (context.neo4jProcess == null)
    {
        startNeo4J(context,payload);
        work.end("OK");
    }
    else
    {
        work.end("ALREADY STARTED");
    }
});

worker.registerWorker("stop-neo4j",function(payload, work)
{
    worker.log("stopping");

    if (context.neo4jProcess)
    {
        context.manualStop = true;
        context.neo4jProcess.kill();
        context.neo4jProcess = null;

        work.end("OK");
    }
    else
    {
        work.end("ALREADY STOPPED");
    }
});

worker.registerWorker("neo4j-status",function(payload, work)
{
    worker.log("status");

    if (context.neo4jProcess)
    {
        work.end("ON");
    }
    else
    {
        work.end("OFF");
    }
});

function startNeo4J(context,payload)
{
    var args = JSON.parse(payload) || [];
    args.unshift("start");

    context.neo4jProcess = spawn("neo4j start", args);
    context.mongoProcess.stdout.pipe(process.stdout, { end: false });
    context.mongoProcess.on('exit', function (code) {

        if (context.manualStop == false)
        {
            console.log('mongo exited with code ' + code + ' ....restarting...');
            startMongo(context,payload);
        }
        else
        {
            context.manualStop = false;
        }
    });
}