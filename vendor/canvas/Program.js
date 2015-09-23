"use strict";
var assert = require('../utils/assert');


function Program(gl) {
  this.gl = gl;
  this.program = this.gl.createProgram();
}

Program.prototype = {
  attach: function (shader) {
    this.gl.attachShader(this.program, shader.shader);
  }, 
  link: function () {
    this.gl.linkProgram(this.program);
    // If creating the shader program failed, alert.
    assert(this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS),
           "Unable to initialize the shader program.");
  },
  use: function () {
    this.gl.useProgram(this.program);
  },
  getAttributeLocation: function(name) {
    return this.gl.getAttribLocation(this.program, name);
  },
  setMatrixUniform: function(name, array) {
    var uniform = this.gl.getUniformLocation(this.program, name);
    this.gl.uniformMatrix4fv(uniform, false, array);
  }
};
module.exports = Program;

