"use strict";

/**
* Run this on windows desktop
* then browse (using google chrome/firefox) to http://[pi ip]:8080/
*/


var http    = require('http');
var express = require('express');


var WebStreamerServer = require('./lib/ffmpeg');

var app  = express();

  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));


var server  = http.createServer(app);
var silence = new WebStreamerServer(server, {
    width : 640,
    height: 480,
});

server.listen(8080);
