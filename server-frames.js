"use strict";

const http               = require('http');
const express            = require('express');

const FrameServer = require('./lib/frames');
const app                = express();



  //public website
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/vendor/dist'));

const server  = http.createServer(app);




const feed    = new FrameServer(server);


server.listen(8080);




