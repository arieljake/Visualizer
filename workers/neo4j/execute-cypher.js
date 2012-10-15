
var name = "execute-cypher";

/**
 * The Neo4j REST API allows querying with Cypher, see Chapter 15, Cypher Query Language.
 * The results are returned as a list of string headers (columns), and a data part, consisting
 * of a list of all rows, every row consisting of a list of REST representations of the field
 * value — Node, Relationship, Path or any simple value like String.
 *
 * http://docs.neo4j.org/chunked/milestone/rest-api-cypher.html
 */

var Neo4j = require('neo4j');
var neo4j_url = 'http://' + process.env.NEO4J_HOST + ':' + process.env.NEO4J_PORT;
var neo4j = new Neo4j.GraphDatabase(neo4j_url);

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
    worker.log("payload: " + payload.toString("utf-8"));

    var input = JSON.parse(payload.toString("utf-8"));

    neo4j.query(input.query, input.params, function(err,result)
    {
        var output;

        if (err)
            output = err.toString();
        else
            output = JSON.stringify(result);

        worker.log("complete");

        work.end(output);
    })
});

worker.log("neo4j_url: " + neo4j_url);