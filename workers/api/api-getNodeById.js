var name = "api-getNodeById";

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);
worker.registerWorker(name,function(payload, work)
{
    worker.log("starting");

    var input = parseInt(payload.toString("utf-8"),10);
    var cypher = {
        query: "START n=node({nodeId}) RETURN n",
        params: {
            nodeId: input
        }
    };

    worker.dir(cypher);
    worker.submitJobAndReturnOutput("execute-cypher", JSON.stringify(cypher), work);
});