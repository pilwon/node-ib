/*
 * lib/index.js
 */

'use strict';

var events = require('events'),
    util = require('util');

var _ = require('lodash');

var C = require('./constants'),
    Controller = require('./controller');

function IB(options) {
  if (!_.isPlainObject(options)) { options = {}; }

  this._options = _.defaults(options, {
    host: C.DEFAULT_HOST,
    port: C.DEFAULT_PORT,
    clientId: C.DEFAULT_CLIENT_ID,
  });

  this._controller = new Controller(this);
}

util.inherits(IB, events.EventEmitter);

IB.prototype._send = function () {
  var args = Array.prototype.slice.call(arguments);
  this._controller.schedule('api', {
    func: args[0],
    args: args.slice(1)
  });
};

IB.prototype.connect = function () {
  this._controller.schedule('connect');
};

IB.prototype.disconnect = function () {
  this._controller.schedule('disconnect');
};

IB.prototype.cancelScannerSubscription = function (tickerId) {
  this._send('cancelScannerSubscription', tickerId);
};

IB.prototype.reqScannerParameters = function () {
  this._send('reqScannerParameters');
};

IB.prototype.reqScannerSubscription = function (tickerId, subscription) {
  this._send('reqScannerSubscription', tickerId, subscription);
};

IB.prototype.reqMktData = function (tickerId, contract, genericTickList, snapshot) {
  this._send('reqMktData', tickerId, contract, genericTickList, snapshot);
};

IB.prototype.cancelHistoricalData = function (tickerId) {
  this._send('cancelHistoricalData', tickerId);
};

IB.prototype.cancelRealTimeBars = function (tickerId) {
  this._send('cancelRealTimeBars', tickerId);
};

IB.prototype.reqHistoricalData = function (tickerId, contract, endDateTime, durationStr,
                                           barSizeSetting, whatToShow, useRTH, formatDate) {
  this._send('reqHistoricalData', tickerId, contract, endDateTime, durationStr,
                                     barSizeSetting, whatToShow, useRTH, formatDate);
};

IB.prototype.reqRealTimeBars = function (tickerId, contract, barSize, whatToShow, useRTH) {
  this._send('reqRealTimeBars', tickerId, contract, barSize, whatToShow, useRTH);
};

IB.prototype.reqContractDetails = function (reqId, contract) {
  this._send('reqContractDetails', reqId, contract);
};

IB.prototype.reqMktDepth = function (tickerId, contract, numRows) {
  this._send('reqMktDepth', tickerId, contract, numRows);
};

IB.prototype.cancelMktData = function (tickerId) {
  this._send('cancelMktData', tickerId);
};

IB.prototype.cancelMktDepth = function (tickerId) {
  this._send('cancelMktDepth', tickerId);
};

IB.prototype.exerciseOptions = function (tickerId, contract, exerciseAction,
                                         exerciseQuantity, account, override) {
  this._send('exerciseOptions', tickerId, contract, exerciseAction,
                                   exerciseQuantity, account, override);
};

IB.prototype.placeOrder = function (id, contract, order) {
  this._send('placeOrder', id, contract, order);
};

IB.prototype.reqAccountUpdates = function (subscribe, acctCode) {
  this._send('reqAccountUpdates', subscribe, acctCode);
};

IB.prototype.reqCurrentTime = function () {
  this._send('reqCurrentTime');
};

IB.prototype.reqExecutions = function (reqId, filter) {
  this._send('reqExecutions', reqId, filter);
};

IB.prototype.cancelOrder = function (id) {
  this._send('cancelOrder', id);
};

IB.prototype.reqOpenOrders = function () {
  this._send('reqOpenOrders');
};

IB.prototype.reqIds = function (numIds) {
  this._send('reqIds', numIds);
};

// IB.prototype. = function () {
//
// };

// Attach version.
Object.defineProperty(IB.prototype, 'VERSION', {
  get: function () {
    return C.VERSION;
  }
});
Object.defineProperty(IB, 'VERSION', {
  get: function () {
    return C.VERSION;
  }
});

// Public API
module.exports = exports = IB;
