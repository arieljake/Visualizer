var name = "api-createNode";

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);
worker.registerWorker(name,function(payload, work)
{
    worker.log("starting");

    var input = JSON.parse(payload.toString("utf8"));
    var params = {};

    if (input.hasOwnProperty("properties"))
    {
        var props = JSON.stringify(input.properties);
        props = props.replace(/\"([^(\")"]+)\":/g,"$1:");

        params.query = 'CREATE n=' + props + ' RETURN n';
    }
    else
    {
        params.query = 'CREATE n RETURN n';
    }

    worker.dir(params);
    worker.submitJobAndReturnOutput("execute-cypher", JSON.stringify(params), work);
});