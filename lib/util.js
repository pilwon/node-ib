/*
 * lib/util.js
 */

'use strict';

var C = require('./constants');

function _findKeyForValue(object, value) {
  for (var key in object) {
    if (object[key] === value) {
      return key;
    }
  }
}

function incomingToString(incoming) {
  return _findKeyForValue(C.INCOMING, incoming);
}

function outgoingToString(outgoing) {
  return _findKeyForValue(C.OUTGOING, outgoing);
}

function tickTypeToString(tickType) {
  return _findKeyForValue(C.TICK_TYPE, tickType);
}

// Public API
exports.incomingToString = incomingToString;
exports.outgoingToString = outgoingToString;
exports.tickTypeToString = tickTypeToString;
