var name = "wc";

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);
worker.registerWorker(name,function(payload, work)
{
    worker.log("starting");

    var input = JSON.parse(payload.toString("utf8"));
    var sentence = input.sentence;
	var numWords = sentence.split(" ").length;

	worker.log("numWords: " + numWords);
	worker.log("complete");

    work.end(numWords);
});