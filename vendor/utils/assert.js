"use strict";

var error = require('./error');

function assert(condition, message) {
  if (!condition) {
    error(message);
  }
}


module.exports = assert;
