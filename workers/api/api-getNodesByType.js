var name = "api-getNodesByType";

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);
worker.registerWorker(name,function(payload, work)
{
    worker.log("starting");

    var input = JSON.parse(payload.toString("utf-8"));
    var params = {
        query: 'START theType=node:types(name = {type}) MATCH theType<-[:is]-ofType RETURN ofType',
        params: {
            type: input.type
        }
    }

    worker.log("type: " + input.type);
    worker.submitJobAndReturnOutput("execute-cypher", JSON.stringify(params), work);
});