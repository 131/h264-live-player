"use strict";

var assert = require('../utils/assert');

/**
 * Represents a WebGL shader script.
 */

function Script() {}

Script.createFromElementId = function(id) {
  var script = document.getElementById(id);
  
  // Didn't find an element with the specified ID, abort.
  assert(script , "Could not find shader with ID: " + id);
  
  // Walk through the source element's children, building the shader source string.
  var source = "";
  var currentChild = script .firstChild;
  while(currentChild) {
    if (currentChild.nodeType == 3) {
      source += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
  
  var res = new Scriptor();
  res.type = script.type;
  res.source = source;
  return res;
};

Script.createFromSource = function(type, source) {
  var res = new Script();
  res.type = type;
  res.source = source;
  return res;
}


module.exports = Script;