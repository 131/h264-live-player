"use strict";

const http               = require('http');
const express            = require('express');
const RemoteTCPFeedRelay = require('./lib/remotetcpfeed');
const app                = express();

/**
* on the remote rpi run
* raspivid -t 0 -o - -w 1280 -h 720 -fps 25 | nc -k -l 5001
* to create a raw tcp h264 streamer
*/

  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));

const server  = http.createServer(app);

var remote = {
  feed_ip   : "172.19.21.58",
  feed_port : process.argv[2] || 5001,
};


console.log("Remote is ", remote);

const feed    = new RemoteTCPFeedRelay(server, remote);


server.listen(8080);


