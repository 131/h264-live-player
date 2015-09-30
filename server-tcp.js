"use strict";

var http               = require('http');
var express            = require('express');
var RemoteTCPFeedRelay = require('./lib/remotetcpfeed');
var app                = express();

/**
* on the remote rpi run
* raspivid -t 0 -o - -w 1280 -h 720 -fps 25 | nc -k -l 5001
* to create a raw tcp h264 streamer
*/

  //public website
app.use(express.static(__dirname + '/public'));

var server  = http.createServer(app);

var feed    = new RemoteTCPFeedRelay(server, {
  feed_ip   : "172.19.20.165",
  feed_port : 5001,
});


server.listen(8080);


