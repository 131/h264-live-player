"use strict";

/**
 * Represents a 2-dimensional size value. 
 */

function Size(w, h) {
  this.w = w;
  this.h = h;
}

Size.prototype = {
  toString: function () {
    return "(" + this.w + ", " + this.h + ")";
  },
  getHalfSize: function() {
    return new Size(this.w >>> 1, this.h >>> 1);
  },
  length: function() {
    return this.w * this.h;
  }
}
module.exports = Size;