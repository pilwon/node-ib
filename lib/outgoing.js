/*
 * lib/outgoing.js
 */

'use strict';

var C = require('./constants');

function Outgoing(ib) {
  this._ib = ib;
}

Outgoing.prototype._send = function () {
  var args = Array.prototype.slice.call(arguments);
  this._ib._controller.run('send', args);
};

Outgoing.prototype.reqCurrentTime = function () {
  var version = 1;
  this._send(C.OUTGOING.REQ_CURRENT_TIME, version);
};

Outgoing.prototype.reqOpenOrders = function () {
  var version = 1;
  this._send(C.OUTGOING.REQ_OPEN_ORDERS, version);
};

// Public API
module.exports = exports = Outgoing;
