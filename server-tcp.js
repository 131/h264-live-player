var express = require('express');
var app     = express();
var fs      = require('fs');
var net     = require('net');
var cp      = require('child_process');


var fileSizeSync = require('nyks/fs/fileSizeSync');
var Splitter     = require('stream-split');



var ip = "172.19.21.140", port = 5001, width = 960, height = 540;



var server = require('http').createServer(app);



var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({server: server});

var sent = 0;

wss.on('connection', function(socket){
  socket.send(JSON.stringify({action : "init", width: width, height : height}));


  var readStream = net.connect(port, ip, function(){
    console.log("remote stream ready");
  });


  var separator = new Buffer([0,0,0,1]);
  readStream = readStream.pipe(new Splitter(separator));



  readStream.on('data', function(data) {
      sent ++;

    wss.clients.forEach(function(socket) {
      if(socket.buzy)
        return;

      socket.buzy = true;
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
