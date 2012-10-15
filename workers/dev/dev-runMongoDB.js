var name = "dev-runMongoDB";

var context = {
    mongoProcess: null,
    manualStop: false
};

var spawn = require('child_process').spawn;
var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);

worker.registerWorker("start-mongo",function(payload, work)
{
    worker.log("starting");

    if (context.mongoProcess == null)
    {
        startMongo(context,payload);
        work.end("OK");
    }
    else
    {
        work.end("ALREADY STARTED");
    }
});

worker.registerWorker("stop-mongo",function(payload, work)
{
    worker.log("stopping");

    if (context.mongoProcess)
    {
        context.manualStop = true;
        context.mongoProcess.kill();
        context.mongoProcess = null;

        work.end("OK");
    }
    else
    {
        work.end("ALREADY STOPPED");
    }
});

worker.registerWorker("mongo-status",function(payload, work)
{
    worker.log("status");

    if (context.mongoProcess)
    {
        work.end("ON");
    }
    else
    {
        work.end("OFF");
    }
});

function startMongo(context,payload)
{
    context.mongoProcess = spawn("mongod", JSON.parse(payload));
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