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
};

IB.prototype.disconnect = function () {
  this._controller.schedule('disconnect');
};

IB.prototype.calculateImpliedVolatility = function (reqId, contract, optionPrice, underPrice) {
  this._send('calculateImpliedVolatility', reqId, contract, optionPrice, underPrice);
};

IB.prototype.calculateOptionPrice = function (reqId, contract, volatility, underPrice) {
  this._send('calculateOptionPrice', reqId, contract, volatility, underPrice);
};

IB.prototype.cancelAccountSummary = function (reqId) {
  this._send('cancelAccountSummary', reqId);
};

IB.prototype.cancelCalculateImpliedVolatility = function (reqId) {
  this._send('cancelCalculateImpliedVolatility', reqId);
};

IB.prototype.cancelCalculateOptionPrice = function (reqId) {
  this._send('cancelCalculateOptionPrice', reqId);
};

IB.prototype.cancelFundamentalData = function (reqId) {
  this._send('cancelFundamentalData', reqId);
};

IB.prototype.cancelHistoricalData = function (tickerId) {
  this._send('cancelHistoricalData', tickerId);
};

IB.prototype.cancelMktData = function (tickerId) {
  this._send('cancelMktData', tickerId);
};

IB.prototype.cancelMktDepth = function (tickerId) {
  this._send('cancelMktDepth', tickerId);
};

IB.prototype.cancelNewsBulletins = function () {
  this._send('cancelNewsBulletins');
};

IB.prototype.cancelOrder = function (id) {
  this._send('cancelOrder', id);
};

IB.prototype.cancelPositions = function () {
  this._send('cancelPositions');
};

IB.prototype.cancelRealTimeBars = function (tickerId) {
  this._send('cancelRealTimeBars', tickerId);
};

IB.prototype.cancelScannerSubscription = function (tickerId) {
  this._send('cancelScannerSubscription', tickerId);
};

IB.prototype.exerciseOptions = function (tickerId, contract, exerciseAction, exerciseQuantity,
                                         account, override) {
  this._send('exerciseOptions', tickerId, contract, exerciseAction, exerciseQuantity,
                                account, override);
};

IB.prototype.placeOrder = function (id, contract, order) {
  this._send('placeOrder', id, contract, order);
};

IB.prototype.replaceFA = function (faDataType, xml) {
  this._send('replaceFA', faDataType, xml);
};

IB.prototype.reqAccountSummary = function (reqId, group, tags) {
  this._send('reqAccountSummary', reqId, group, tags);
};

IB.prototype.reqAccountUpdates = function (subscribe, acctCode) {
  this._send('reqAccountUpdates', subscribe, acctCode);
};

IB.prototype.reqAllOpenOrders = function () {
  this._send('reqAllOpenOrders');
};

IB.prototype.reqAutoOpenOrders = function (bAutoBind) {
  this._send('reqAutoOpenOrders', bAutoBind);
};

IB.prototype.reqContractDetails = function (reqId, contract) {
  this._send('reqContractDetails', reqId, contract);
};

IB.prototype.reqCurrentTime = function () {
  this._send('reqCurrentTime');
};

IB.prototype.reqExecutions = function (reqId, filter) {
  this._send('reqExecutions', reqId, filter);
};

IB.prototype.reqFundamentalData = function (reqId, contract, reportType) {
  this._send('reqFundamentalData', reqId, contract, reportType);
};

IB.prototype.reqGlobalCancel = function () {
  this._send('reqGlobalCancel');
};

IB.prototype.reqHistoricalData = function (tickerId, contract, endDateTime, durationStr,
                                           barSizeSetting, whatToShow, useRTH, formatDate) {
  this._send('reqHistoricalData', tickerId, contract, endDateTime, durationStr,
                                     barSizeSetting, whatToShow, useRTH, formatDate);
};

IB.prototype.reqIds = function (numIds) {
  this._send('reqIds', numIds);
};

IB.prototype.reqManagedAccts = function () {
  this._send('reqManagedAccts');
};

IB.prototype.reqMarketDataType = function (marketDataType) {
  this._send('reqMarketDataType', marketDataType);
};

IB.prototype.reqMktData = function (tickerId, contract, genericTickList, snapshot) {
  this._send('reqMktData', tickerId, contract, genericTickList, snapshot);
};

IB.prototype.reqMktDepth = function (tickerId, contract, numRows) {
  this._send('reqMktDepth', tickerId, contract, numRows);
};

IB.prototype.reqNewsBulletins = function (allMsgs) {
  this._send('reqNewsBulletins', allMsgs);
};

IB.prototype.reqOpenOrders = function () {
  this._send('reqOpenOrders');
};

IB.prototype.reqPositions = function () {
  this._send('reqPositions');
};

IB.prototype.reqRealTimeBars = function (tickerId, contract, barSize, whatToShow, useRTH) {
  this._send('reqRealTimeBars', tickerId, contract, barSize, whatToShow, useRTH);
};

IB.prototype.reqScannerParameters = function () {
  this._send('reqScannerParameters');
};

IB.prototype.reqScannerSubscription = function (tickerId, subscription) {
  this._send('reqScannerSubscription', tickerId, subscription);
};

IB.prototype.requestFA = function (faDataType) {
  this._send('requestFA', faDataType);
};

IB.prototype.setServerLogLevel = function (logLevel) {
  this._send('setServerLogLevel', logLevel);
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
