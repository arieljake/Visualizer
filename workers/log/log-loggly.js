var name = "log-loggly";

var Loggly = require('loggly');
var loggly = Loggly.createClient({
    subdomain: "deskmasters",
    auth: {
        username: "worker",
        password: "worker1"
    }
});

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

    loggly.log("948ba1eb-a187-438f-95bd-9e6acc10866c",payload,function(err,results)
    {
        if (err)
        {
            console.log("error: logToLoggly");
            console.log(err.toString());
            console.log("msg: " + msg);
        }
    })

    worker.log("completed!");
    work.end(payload);
});