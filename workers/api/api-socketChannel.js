var name = "api-socketChannel";
var port = parseInt(process.env.SOCKET_PORT,10);

var io = require('socket.io').listen(port);
io.sockets.on('connection', function (socket)
{

});

var Worker = require("../../lib/Worker.js");
var worker = new Worker(name);
worker.registerWorker(name,function(payload, work)
{
    var params = JSON.parse(payload.toString("utf8"));

    var channel = params.channel;
    var msg = params.msg;

    worker.log("sending " + msg + " over " + channel);

    io.sockets.emit(channel, msg);

    work.end();
});