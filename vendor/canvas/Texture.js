"use strict";

var assert = require('../utils/assert');

/**
 * Represents a WebGL texture object.
 */

function Texture(gl, size, format) {
  this.gl = gl;
  this.size = size;
  this.texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, this.texture);
  this.format = format ? format : gl.LUMINANCE; 
  gl.texImage2D(gl.TEXTURE_2D, 0, this.format, size.w, size.h, 0, this.format, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

var textureIDs = null;
Texture.prototype = {
  fill: function(textureData, useTexSubImage2D) {
    var gl = this.gl;
    assert(textureData.length >= this.size.w * this.size.h, 
           "Texture size mismatch, data:" + textureData.length + ", texture: " + this.size.w * this.size.h);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    if (useTexSubImage2D) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.size.w , this.size.h, this.format, gl.UNSIGNED_BYTE, textureData);
    } else {
      // texImage2D seems to be faster, thus keeping it as the default
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.size.w, this.size.h, 0, this.format, gl.UNSIGNED_BYTE, textureData);
    }
  },
  bind: function(n, program, name) {
    var gl = this.gl;
    if (!textureIDs) {
      textureIDs = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2];
    }
    gl.activeTexture(textureIDs[n]);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(program.program, name), n);
  }
};
module.exports = Texture;

