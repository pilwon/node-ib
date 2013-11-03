/*
 * lib/index.js
 */

'use strict';

var assert = require('assert'),
    events = require('events'),
    util = require('util');

var _ = require('lodash');

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
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('cancelAccountSummary', reqId);

  return this;
};

IB.prototype.cancelCalculateImpliedVolatility = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('cancelCalculateImpliedVolatility', reqId);

  return this;
};

IB.prototype.cancelCalculateOptionPrice = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('cancelCalculateOptionPrice', reqId);

  return this;
};

IB.prototype.cancelFundamentalData = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('cancelFundamentalData', reqId);

  return this;
};

IB.prototype.cancelHistoricalData = function (tickerId) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);

  this._send('cancelHistoricalData', tickerId);

  return this;
};

IB.prototype.cancelMktData = function (tickerId) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);

  this._send('cancelMktData', tickerId);

  return this;
};

IB.prototype.cancelMktDepth = function (tickerId) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);

  this._send('cancelMktDepth', tickerId);

  return this;
};

IB.prototype.cancelNewsBulletins = function () {
  this._send('cancelNewsBulletins');

  return this;
};

IB.prototype.cancelOrder = function (id) {
  assert(_.isNumber(id), '"id" must be an integer - ' + id);

  this._send('cancelOrder', id);

  return this;
};

IB.prototype.cancelPositions = function () {
  this._send('cancelPositions');

  return this;
};

IB.prototype.cancelRealTimeBars = function (tickerId) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);

  this._send('cancelRealTimeBars', tickerId);

  return this;
};

IB.prototype.cancelScannerSubscription = function (tickerId) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);

  this._send('cancelScannerSubscription', tickerId);

  return this;
};

IB.prototype.exerciseOptions = function (tickerId, contract, exerciseAction, exerciseQuantity,
                                         account, override) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isNumber(exerciseAction), '"exerciseAction" must be an integer - ' + exerciseAction);
  assert(_.isNumber(exerciseQuantity), '"exerciseQuantity" must be an integer - ' + exerciseQuantity);
  assert(_.isString(account), '"account" must be a string - ' + account);
  assert(_.isNumber(override), '"override" must be an integer - ' + override);

  this._send('exerciseOptions', tickerId, contract, exerciseAction, exerciseQuantity,
                                account, override);

  return this;
};

IB.prototype.placeOrder = function (id, contract, order) {
  assert(_.isNumber(id), '"id" must be an integer - ' + id);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isPlainObject(order), '"order" must be a plain object - ' + order);

  this._send('placeOrder', id, contract, order);

  return this;
};

IB.prototype.replaceFA = function (faDataType, xml) {
  assert(_.isNumber(faDataType), '"faDataType" must be an integer - ' + faDataType);
  assert(_.isString(xml), '"xml" must be a string - ' + xml);

  this._send('replaceFA', faDataType, xml);

  return this;
};

IB.prototype.reqAccountSummary = function (reqId, group, tags) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isString(group), '"group" must be a string - ' + group);
  assert(_.isArray(tags) || _.isString(tags), '"tags" must be array or string - ' + tags);

  if (_.isArray(tags)) { tags = tags.join(','); }

  this._send('reqAccountSummary', reqId, group, tags);

  return this;
};

IB.prototype.reqAccountUpdates = function (subscribe, acctCode) {
  assert(_.isBoolean(subscribe), '"subscribe" must be a boolean - ' + subscribe);
  assert(_.isString(acctCode), '"acctCode" must be a string - ' + acctCode);

  this._send('reqAccountUpdates', subscribe, acctCode);

  return this;
};

IB.prototype.reqAllOpenOrders = function () {
  this._send('reqAllOpenOrders');

  return this;
};

IB.prototype.reqAutoOpenOrders = function (bAutoBind) {
  assert(_.isBoolean(bAutoBind), '"bAutoBind" must be a boolean - ' + bAutoBind);

  this._send('reqAutoOpenOrders', bAutoBind);

  return this;
};

IB.prototype.reqContractDetails = function (reqId, contract) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);

  this._send('reqContractDetails', reqId, contract);

  return this;
};

IB.prototype.reqCurrentTime = function () {
  this._send('reqCurrentTime');

  return this;
};

IB.prototype.reqExecutions = function (reqId, filter) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isPlainObject(filter), '"filter" must be a plain object - ' + filter);

  this._send('reqExecutions', reqId, filter);

  return this;
};

IB.prototype.reqFundamentalData = function (reqId, contract, reportType) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(reportType), '"reportType" must be a string - ' + reportType);

  this._send('reqFundamentalData', reqId, contract, reportType);

  return this;
};

IB.prototype.reqGlobalCancel = function () {
  this._send('reqGlobalCancel');

  return this;
};

IB.prototype.reqHistoricalData = function (tickerId, contract, endDateTime, durationStr,
                                           barSizeSetting, whatToShow, useRTH, formatDate) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(endDateTime), '"endDateTime" must be a string - ' + endDateTime);
  assert(_.isString(durationStr), '"durationStr" must be a string - ' + durationStr);
  assert(_.isString(barSizeSetting), '"barSizeSetting" must be a string - ' + barSizeSetting);
  assert(_.isString(whatToShow), '"whatToShow" must be a string - ' + whatToShow);
  assert(_.isNumber(useRTH), '"useRTH" must be an integer - ' + useRTH);
  assert(_.isNumber(formatDate), '"formatDate" must be an integer - ' + formatDate);

  this._send('reqHistoricalData', tickerId, contract, endDateTime, durationStr,
                                     barSizeSetting, whatToShow, useRTH, formatDate);

  return this;
};

IB.prototype.reqIds = function (numIds) {
  assert(_.isNumber(numIds), '"numIds" must be an integer - ' + numIds);

  this._send('reqIds', numIds);

  return this;
};

IB.prototype.reqManagedAccts = function () {
  this._send('reqManagedAccts');

  return this;
};

IB.prototype.reqMarketDataType = function (marketDataType) {
  assert(_.isNumber(marketDataType), '"marketDataType" must be an integer - ' + marketDataType);

  this._send('reqMarketDataType', marketDataType);

  return this;
};

IB.prototype.reqMktData = function (tickerId, contract, genericTickList, snapshot) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(genericTickList), '"genericTickList" must be a string - ' + genericTickList);
  assert(_.isBoolean(snapshot), '"snapshot" must be a boolean - ' + snapshot);

  this._send('reqMktData', tickerId, contract, genericTickList, snapshot);

  return this;
};

IB.prototype.reqMktDepth = function (tickerId, contract, numRows) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isNumber(numRows), '"numRows" must be an integer - ' + numRows);

  this._send('reqMktDepth', tickerId, contract, numRows);

  return this;
};

IB.prototype.reqNewsBulletins = function (allMsgs) {
  assert(_.isBoolean(allMsgs), '"allMsgs" must be a boolean - ' + allMsgs);

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
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isNumber(barSize), '"barSize" must be an integer - ' + barSize);
  assert(_.isString(whatToShow), '"whatToShow" must be a string - ' + whatToShow);
  assert(_.isBoolean(useRTH), '"useRTH" must be a boolean - ' + useRTH);

  this._send('reqRealTimeBars', tickerId, contract, barSize, whatToShow, useRTH);

  return this;
};

IB.prototype.reqScannerParameters = function () {
  this._send('reqScannerParameters');

  return this;
};

IB.prototype.reqScannerSubscription = function (tickerId, subscription) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(subscription), '"subscription" must be a plain object - ' + subscription);

  this._send('reqScannerSubscription', tickerId, subscription);

  return this;
};

IB.prototype.requestFA = function (faDataType) {
  assert(_.isNumber(faDataType), '"faDataType" must be an integer - ' + faDataType);

  this._send('requestFA', faDataType);

  return this;
};

IB.prototype.setServerLogLevel = function (logLevel) {
  assert(_.isNumber(logLevel), '"logLevel" must be an integer - ' + logLevel);

  this._send('setServerLogLevel', logLevel);

  return this;
};

// Attach constants.
_.keys(C).forEach(function (key) {
  Object.defineProperty(IB.prototype, key, {
    get: function () {
      return C[key];
    }
  });
  Object.defineProperty(IB, key, {
    get: function () {
      return C[key];
    }
  });
});

// Attach modules.
['contract', 'order', 'util'].forEach(function (module) {
  Object.defineProperty(IB.prototype, module, {
    get: function () {
      return require('./' + module);
    }
  });
  Object.defineProperty(IB, module, {
    get: function () {
      return require('./' + module);
    }
  });
});

// Public API
module.exports = exports = IB;
