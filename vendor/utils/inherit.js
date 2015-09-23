"use strict";

/**
 * Creates a new prototype object derived from another objects prototype along with a list of additional properties.
 *
 * @param base object whose prototype to use as the created prototype object's prototype
 * @param properties additional properties to add to the created prototype object
 */
function inherit(base, properties) {
  var prot = Object.create(base.prototype);
  for (var p in properties) {
    prot[p] = properties[p];
  }
  return prot;
}

module.exports = inherit;