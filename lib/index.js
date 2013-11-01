/*
 * lib/index.js
 */

'use strict';

var events = require('events'),
    util = require('util');

var C = require('./constants'),
    Controller = require('./controller');

function IB(options) {
  this._controller = new Controller(this, options);

  this.on('error', function () {});
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

  return this;
};

IB.prototype.disconnect = function () {
  this._controller.schedule('disconnect');

  return this;
};

IB.prototype.calculateImpliedVolatility = function (reqId, contract, optionPrice, underPrice) {
  this._send('calculateImpliedVolatility', reqId, contract, optionPrice, underPrice);

  return this;
};

IB.prototype.calculateOptionPrice = function (reqId, contract, volatility, underPrice) {
  this._send('calculateOptionPrice', reqId, contract, volatility, underPrice);

  return this;
};

IB.prototype.cancelAccountSummary = function (reqId) {
  this._send('cancelAccountSummary', reqId);

  return this;
};

IB.prototype.cancelCalculateImpliedVolatility = function (reqId) {
  this._send('cancelCalculateImpliedVolatility', reqId);

  return this;
};

IB.prototype.cancelCalculateOptionPrice = function (reqId) {
  this._send('cancelCalculateOptionPrice', reqId);

  return this;
};

IB.prototype.cancelFundamentalData = function (reqId) {
  this._send('cancelFundamentalData', reqId);

  return this;
};

IB.prototype.cancelHistoricalData = function (tickerId) {
  this._send('cancelHistoricalData', tickerId);

  return this;
};

IB.prototype.cancelMktData = function (tickerId) {
  this._send('cancelMktData', tickerId);

  return this;
};

IB.prototype.cancelMktDepth = function (tickerId) {
  this._send('cancelMktDepth', tickerId);

  return this;
};

IB.prototype.cancelNewsBulletins = function () {
  this._send('cancelNewsBulletins');

  return this;
};

IB.prototype.cancelOrder = function (id) {
  this._send('cancelOrder', id);

  return this;
};

IB.prototype.cancelPositions = function () {
  this._send('cancelPositions');

  return this;
};

IB.prototype.cancelRealTimeBars = function (tickerId) {
  this._send('cancelRealTimeBars', tickerId);

  return this;
};

IB.prototype.cancelScannerSubscription = function (tickerId) {
  this._send('cancelScannerSubscription', tickerId);

  return this;
};

IB.prototype.exerciseOptions = function (tickerId, contract, exerciseAction, exerciseQuantity,
                                         account, override) {
  this._send('exerciseOptions', tickerId, contract, exerciseAction, exerciseQuantity,
                                account, override);

  return this;
};

IB.prototype.placeOrder = function (id, contract, order) {
  this._send('placeOrder', id, contract, order);

  return this;
};

IB.prototype.replaceFA = function (faDataType, xml) {
  this._send('replaceFA', faDataType, xml);

  return this;
};

IB.prototype.reqAccountSummary = function (reqId, group, tags) {
  this._send('reqAccountSummary', reqId, group, tags);

  return this;
};

IB.prototype.reqAccountUpdates = function (subscribe, acctCode) {
  this._send('reqAccountUpdates', subscribe, acctCode);

  return this;
};

IB.prototype.reqAllOpenOrders = function () {
  this._send('reqAllOpenOrders');

  return this;
};

IB.prototype.reqAutoOpenOrders = function (bAutoBind) {
  this._send('reqAutoOpenOrders', bAutoBind);

  return this;
};

IB.prototype.reqContractDetails = function (reqId, contract) {
  this._send('reqContractDetails', reqId, contract);

  return this;
};

IB.prototype.reqCurrentTime = function () {
  this._send('reqCurrentTime');

  return this;
};

IB.prototype.reqExecutions = function (reqId, filter) {
  this._send('reqExecutions', reqId, filter);

  return this;
};

IB.prototype.reqFundamentalData = function (reqId, contract, reportType) {
  this._send('reqFundamentalData', reqId, contract, reportType);

  return this;
};

IB.prototype.reqGlobalCancel = function () {
  this._send('reqGlobalCancel');

  return this;
};

IB.prototype.reqHistoricalData = function (tickerId, contract, endDateTime, durationStr,
                                           barSizeSetting, whatToShow, useRTH, formatDate) {
  this._send('reqHistoricalData', tickerId, contract, endDateTime, durationStr,
                                     barSizeSetting, whatToShow, useRTH, formatDate);

  return this;
};

IB.prototype.reqIds = function (numIds) {
  this._send('reqIds', numIds);

  return this;
};

IB.prototype.reqManagedAccts = function () {
  this._send('reqManagedAccts');

  return this;
};

IB.prototype.reqMarketDataType = function (marketDataType) {
  this._send('reqMarketDataType', marketDataType);

  return this;
};

IB.prototype.reqMktData = function (tickerId, contract, genericTickList, snapshot) {
  this._send('reqMktData', tickerId, contract, genericTickList, snapshot);

  return this;
};

IB.prototype.reqMktDepth = function (tickerId, contract, numRows) {
  this._send('reqMktDepth', tickerId, contract, numRows);

  return this;
};

IB.prototype.reqNewsBulletins = function (allMsgs) {
  this._send('reqNewsBulletins', allMsgs);

  return this;
};

IB.prototype.reqOpenOrders = function () {
  this._send('reqOpenOrders');

  return this;
};

IB.prototype.reqPositions = function () {
  this._send('reqPositions');

  return this;
};

IB.prototype.reqRealTimeBars = function (tickerId, contract, barSize, whatToShow, useRTH) {
  this._send('reqRealTimeBars', tickerId, contract, barSize, whatToShow, useRTH);

  return this;
};

IB.prototype.reqScannerParameters = function () {
  this._send('reqScannerParameters');

  return this;
};

IB.prototype.reqScannerSubscription = function (tickerId, subscription) {
  this._send('reqScannerSubscription', tickerId, subscription);

  return this;
};

IB.prototype.requestFA = function (faDataType) {
  this._send('requestFA', faDataType);

  return this;
};

IB.prototype.setServerLogLevel = function (logLevel) {
  this._send('setServerLogLevel', logLevel);

  return this;
};

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
