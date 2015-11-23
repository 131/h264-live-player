"use strict";

var http               = require('http');
var express            = require('express');
var RemoteTCPFeedRelay = require('./lib/static');
var app                = express();



  //public website
app.use(express.static(__dirname + '/public'));

var server  = http.createServer(app);

var source = {
  width     : 480,
  height    : 270,

  video_path     : "samples/admiral.264",
  video_duration : 58,
};


source = {
  width     : 960,
  height    : 540,

  video_path     : "samples/test.h264",
  video_duration : 58,
};




var feed    = new RemoteTCPFeedRelay(server, source);


server.listen(8080);




