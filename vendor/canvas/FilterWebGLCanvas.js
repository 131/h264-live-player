"use strict";

var Class = require('uclass');


var vertexShaderScript = Script.createFromSource("x-shader/x-vertex", `
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  varying highp vec2 vTextureCoord;
  void main(void) {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
  }
`);

var fragmentShaderScript = Script.createFromSource("x-shader/x-fragment", [
  precision highp float;
  varying highp vec2 vTextureCoord;
  uniform sampler2D FTexture;

  void main(void) {
   gl_FragColor = texture2D(FTexture,  vTextureCoord);
  }
`);


var FilterWebGLCanvas = new Class({
  Extends  : WebGLCanvas,

  initialize : function(canvas, size, useFrameBuffer) {
    FilterWebGLCanvas.parent.initialize.call(this, canvas, size, useFrameBuffer);
  },

  onInitShaders: function() {
    this.program = new Program(this.gl);
    this.program.attach(new Shader(this.gl, vertexShaderScript));
    this.program.attach(new Shader(this.gl, fragmentShaderScript));
    this.program.link();
    this.program.use();
    this.vertexPositionAttribute = this.program.getAttributeLocation("aVertexPosition");
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
    this.textureCoordAttribute = this.program.getAttributeLocation("aTextureCoord");
    this.gl.enableVertexAttribArray(this.textureCoordAttribute);
  },

  onInitTextures: function () {
    console.log("creatingTextures: size: " + this.size);
    this.FTexture = new Texture(this.gl, this.size, this.gl.RGBA);
  },

  onInitSceneTextures: function () {
    this.FTexture.bind(0, this.program, "FTexture");
  },

  process: function(buffer, output) {
    this.FTexture.fill(buffer);
    this.drawScene();
    this.readPixels(output);
  },

  toString: function() {
    return "FilterWebGLCanvas Size: " + this.size;
  }
});



module.exports = FilterWebGLCanvas;

