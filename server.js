var express = require('express');
var app     = express();
var fs      = require('fs');
var cp      = require('child_process');
var Throttle = require('stream-throttle').Throttle;
var fileSizeSync = require('nyks/fs/fileSizeSync');
var Splitter     = require('stream-split');





var source = "movieSample.h264", source_duration = 58, width = 1280, height = 738;


source = "admiral.264", source_duration = 58, width = 480, height = 270;
source = "out.h264",  source_duration = 58, width = 960, height = 540;

var sourceThrottleRate = fileSizeSync(source) / source_duration;

var readStream = fs.createReadStream(source);
  

  //throttle for real time simulation
readStream = readStream.pipe(new Throttle({rate: sourceThrottleRate}));

  var separator = new Buffer([0,0,0,1]);//NAL break
readStream = readStream.pipe(new Splitter(separator));

readStream.pause();

var server = require('http').createServer(app);



var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({server: server});

var sent = 0;

wss.on('connection', function(socket){
  socket.send(JSON.stringify({action : "init", width: width, height : height}));

  socket.on("message", function(data){
    var cmd = "" + data, action = data.split(' ')[0];
    if(action == "REQUESTSTREAM")
      readStream.resume();
    if(action == "STOPSTREAM")
      readStream.pause();

    console.log("Incomming data", data);

  });




  readStream.on('data', function(data) {
      sent ++;

    wss.clients.forEach(function(socket) {
      if(socket.buzy)
        return;

      socket.buzy = true;
      socket.buzy = false;
      socket.send(Buffer.concat([separator, data]), { binary: true}, function ack(error) {
        socket.buzy = false;

        console.log("DRAINED", sent);
        // if error is not defined, the send has been completed, 
        // otherwise the error object will indicate what failed. 
      });
    });

  });

  console.log('New guy');


  socket.on('close', function() {
    console.log('stopping client interval');

  });
});


app.use(express.static(__dirname + '/public'));
server.listen(8080, "0.0.0.0");
