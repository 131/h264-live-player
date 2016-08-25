"use strict";

var Avc            = require('../broadway/Decoder');
var YUVWebGLCanvas = require('../canvas/YUVWebGLCanvas');
var Size           = require('../utils/Size');
var Class          = require('uclass');


var WSAvcPlayer = new Class({
  Binds : ['onPictureDecodedWebGL', 'onPictureDecodedCanvas'],

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


  onPictureDecodedCanvas : function (buffer, width, height) {
    if (!buffer) {
      return;
    }
    var lumaSize = width * height;
    var chromaSize = lumaSize >> 2;
    
    var ybuf = buffer.subarray(0, lumaSize);
    var ubuf = buffer.subarray(lumaSize, lumaSize + chromaSize);
    var vbuf = buffer.subarray(lumaSize + chromaSize, lumaSize + 2 * chromaSize);
    
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var yIndex = x + y * width;
        var uIndex = ~~(y / 2) * ~~(width / 2) + ~~(x / 2);
        var vIndex = ~~(y / 2) * ~~(width / 2) + ~~(x / 2);
        var R = 1.164 * (ybuf[yIndex] - 16) + 1.596 * (vbuf[vIndex] - 128);
        var G = 1.164 * (ybuf[yIndex] - 16) - 0.813 * (vbuf[vIndex] - 128) - 0.391 * (ubuf[uIndex] - 128);
        var B = 1.164 * (ybuf[yIndex] - 16) + 2.018 * (ubuf[uIndex] - 128);
        
        var rgbIndex = yIndex * 4;
        this.canvasBuffer.data[rgbIndex+0] = R;
        this.canvasBuffer.data[rgbIndex+1] = G;
        this.canvasBuffer.data[rgbIndex+2] = B;
        this.canvasBuffer.data[rgbIndex+3] = 0xff;
      }
    }
    
    this.canvasCtx.putImageData(this.canvasBuffer, 0, 0);
    
    var date = new Date();
    //console.log("WSAvcPlayer: Decode time: " + (date.getTime() - this.rcvtime) + " ms");
  },


  decode : function(data) {
    var naltype = "invalid frame";
    console.log(data[4]);
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
    console.log("WSAvcPlayer: Passed " + naltype + " to decoder");
    /* Decode Pictures */
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
    this.ws.onopen = function() {
      console.log("WSAvcPlayer: Connected to " + url);
    }.bind(this);
    this.ws.onmessage = function(evt) {
      if(typeof evt.data == "string")
        return this.cmd(JSON.parse(evt.data));

      this.pktnum++;
      var data = new Uint8Array(evt.data);
      console.log("WSAvcPlayer: [Pkt " + this.pktnum + " (" + evt.data.byteLength + " bytes)]");
      var date = new Date();
      this.rcvtime = date.getTime();
      this.decode(data);
      this.prevframe = data;
    }.bind(this);
    this.ws.onclose = function()	{ 
      // websocket is closed.
      console.log("WSAvcPlayer: Connection closed")
    };
  },


  initCanvas : function(width, height) {
    if (this.canvastype == "webgl") {
      var webGLCanvas = new YUVWebGLCanvas(this.canvas, new Size(width, height));
      this.avc.onPictureDecoded = webGLCanvas.decode;
    } else if (this.canvastype == "canvas") {
      this.avc.onPictureDecoded = this.onPictureDecodedCanvas;
      this.canvasCtx = this.canvas.getContext("2d");
      this.canvasBuffer = this.canvasCtx.createImageData(width, height);
    }
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
