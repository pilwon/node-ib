var C = require('./constants');

function _findKeyForValue(object, value) {
  for (var key in object) {
    if (object[key] === value) {
      return key;
    }
  }
  
  return C.TICK_TYPE.UNKNOWN;
}

function incomingToString(incoming) {
  return _findKeyForValue(C.INCOMING, incoming);
}

function numberToString(number) {
  if (number === Number.MAX_VALUE) {
    return 'MAX';
  } else if (number === Number.MIN_VALUE) {
    return 'MIN';
  } else {
    return number.toString();
  }
}

function outgoingToString(outgoing) {
  return _findKeyForValue(C.OUTGOING, outgoing);
}

function tickTypeToString(tickType) {
  return _findKeyForValue(C.TICK_TYPE, tickType);
}

exports.incomingToString = incomingToString;
exports.numberToString = numberToString;
exports.outgoingToString = outgoingToString;
exports.tickTypeToString = tickTypeToString;
