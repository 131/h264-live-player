"use strict";
var Class = require('uclass');

var YUVCanvas = new Class({

  Binds : ['decode'],

  initialize : function(canvas, size) {
    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext("2d");
    this.canvasBuffer = this.canvasCtx.createImageData(size.w, size.h);
  },

  decode : function (buffer, width, height) {
    if (!buffer)
      return;

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

});


module.exports = YUVCanvas;