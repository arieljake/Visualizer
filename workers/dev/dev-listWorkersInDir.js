var name = "dev-listWorkersInDir";

var fs = require("fs");
var _ = require("underscore");
var _str = require("underscore.string");
var fileUtils = require("file-utils");
var File = fileUtils.File;

var workerExclusionList = "/Users/arieljake/Documents/Projects/Gearman/workers/dev/workerExclusionList.txt";
var workerRoot = "/Users/arieljake/Documents/Projects/Gearman/workers";

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);

worker.registerWorker("getWorkers",function(payload, work)
{
    worker.log("reading workers from " + workerRoot);

    loadWorkers(workerRoot,function(workers)
    {
        worker.log("returning " + workers.length + " workers");

        work.end(JSON.stringify(workers));
    });
});

function loadWorkers(dir,cb)
{
    worker.log("loading exclusion list from " + workerExclusionList);

    fs.readFile(workerExclusionList, function (err,exclusionList)
    {
        var excludedFiles = exclusionList.toString("utf8").split("\n");

        (new File(dir)).list(function (err, files)
        {
            var workers = [];
            pullWorkersFromFSTree(workers,files,excludedFiles);
            cb(workers);
        });
    })
}

function pullWorkersFromFSTree(workers,treeNode,excludedFiles)
{
    var children = _.keys(treeNode);

    children.forEach(function (child)
    {
        if (typeof treeNode[child] == "string")
        {
            var path = treeNode[child];
            var filename = path.split("/").pop();

            // 1. js files
            // 2. start with lower case letter (no classes)
            // 3. not on exclusion list
            if (_str.endsWith(path, ".js") && child.charCodeAt(0) >= 91 && excludedFiles.indexOf(filename) == -1)
            {
                workers.push(path);
            }
        }
        else
        {
            pullWorkersFromFSTree(workers,treeNode[child],excludedFiles);
        }
    });
}