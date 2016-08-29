"use strict";

var Avc            = require('../broadway/Decoder');
var YUVWebGLCanvas = require('../canvas/YUVWebGLCanvas');
var YUVCanvas      = require('../canvas/YUVCanvas');
var Size           = require('../utils/Size');
var Class          = require('uclass');
var Events         = require('uclass/events');

var WSAvcPlayer = new Class({
  Implements : [Events],


  initialize : function(canvas, canvastype) {

    this.canvas     = canvas;
    this.canvastype = canvastype;

    // AVC codec initialization
    this.avc = new Avc();
    if(false) this.avc.configure({
      filter: "original",
      filterHorLuma: "optimized",
      filterVerLumaEdge: "optimized",
      getBoundaryStrengthsA: "optimized"
    });

    //WebSocket variable
    this.ws;
    this.pktnum = 0;
    this.rcvtime;
    this.prevframe;

  },


  decode : function(data) {
    var naltype = "invalid frame";

    if (data.length > 4) {
      if (data[4] == 0x65) {
        naltype = "I frame";
      }
      else if (data[4] == 0x41) {
        naltype = "P frame";
      }
      else if (data[4] == 0x67) {
        naltype = "SPS";
      }
      else if (data[4] == 0x68) {
        naltype = "PPS";
      }
    }
    //console.log("WSAvcPlayer: Passed " + naltype + " to decoder");
    this.avc.decode(data);
  },

  connect : function(url) {

    // Websocket initialization
    if (this.ws != undefined) {
      this.ws.close();
      delete this.ws;
    }
    this.ws = new WebSocket(url);
    this.ws.binaryType = "arraybuffer";

    this.ws.onopen = () => {
      console.log("WSAvcPlayer: Connected to " + url);
    };

    this.ws.onmessage = (evt) => {
      if(typeof evt.data == "string")
        return this.cmd(JSON.parse(evt.data));

      this.pktnum++;
      var data = new Uint8Array(evt.data);
      //console.log("WSAvcPlayer: [Pkt " + this.pktnum + " (" + evt.data.byteLength + " bytes)]");
      var date = new Date();
      this.rcvtime = date.getTime();
      this.decode(data);
      this.prevframe = data;
    };

    this.ws.onclose = () => { 
      console.log("WSAvcPlayer: Connection closed")
    };

  },

  initCanvas : function(width, height) {
    var canvasFactory = this.canvastype == "webgl" || this.canvastype == "YUVWebGLCanvas"
                        ? YUVWebGLCanvas
                        : YUVCanvas;

    var canvas = new canvasFactory(this.canvas, new Size(width, height));
    this.avc.onPictureDecoded = canvas.decode;
    this.emit("canvasReady", width, height);
  },

  cmd : function(cmd){
    console.log("Incoming request", cmd);

    if(cmd.action == "init") {
      this.initCanvas(cmd.width, cmd.height);
      this.canvas.width  = cmd.width;
      this.canvas.height = cmd.height;
    }
  },

  disconnect : function() {
    this.ws.close();
  },

  playStream : function() {
    var message = "REQUESTSTREAM ";
    this.ws.send(message);
    console.log("WSAvcPlayer: Sent " + message);
  },


  stopStream : function() {
    this.ws.send("STOPSTREAM");
    console.log("WSAvcPlayer: Sent STOPSTREAM");
  },
});


module.exports = WSAvcPlayer;
