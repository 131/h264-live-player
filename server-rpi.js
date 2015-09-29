"use strict";

/**
* Run this on a raspberry pi 
* then browse (using google chrome/firefox) to http://[pi ip]:8080/
*/


var http    = require('http');
var express = require('express');


var WebStreamerServer = require('./lib/raspivid');

var app  = express();

  //public website
app.use(express.static(__dirname + '/public'));


var server  = http.createServer(app);
var silence = new WebStreamerServer(server);

server.listen(8080);
