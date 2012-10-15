var program = require("commander");
var Gearman = require("node-gearman");

var gearman = new Gearman(process.env.GEARMAN_HOST, process.env.GEARMAN_PORT);
gearman.on("connect", function(){
    program.parse(process.argv);
});
gearman.connect();

program
	.version('0.0.1');

program
    .command('wc <value>')
    .description('test echo')
    .action(function(value)
    {
        var job = gearman.submitJob("wc", value);

        job.on("data", function(data){
            log(data.toString("utf-8")); // gnirts tset
        });

        job.on("end", function(){
            log("wc job completed!");
        });

        job.on("error", function(error){
            log(error.message);
        });
    });

program
    .command('cypher <query> [<params>]')
    .description('test cypher')
    .action(function(query,params)
    {
        log("starting cypher job");

        var input = {
            query: query
        };

        if (params)
        {
            query.params = JSON.parse(params);
        }

        var job = gearman.submitJob("execute-cypher", JSON.stringify(input));

        job.on("data", function(data){
            log("data: " + data.toString("utf-8"));
        });

        job.on("end", function(){
            log("cypher job completed!");
        });

        job.on("error", function(error){
            log("error: " + error.message);
        });
    });

program
    .command('getMembersOfType <type>')
    .description('test cypher')
    .action(function(type)
    {
        log("starting getMembersOfType job");

        var job = gearman.submitJob("tags-getMembersOfType", JSON.stringify({
            type: type
        }));

        job.on("data", function(data){
            log("data: " + data.toString("utf-8"));
        });

        job.on("end", function(){
            log("getMembersOfType job completed!");
        });

        job.on("error", function(error){
            log("error: " + error.message);
        });
    });

        function log(msg)
{
    console.log((new Date()).getTime() + " program -- " + msg);
}