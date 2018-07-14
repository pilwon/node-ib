var assert = require('assert');
var events = require('events');
var util = require('util');

var _ = require('lodash');

var C = require('./constants');
var Controller = require('./controller');

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

IB.prototype.cancelPositionsMulti = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('cancelPositionsMulti', reqId);

  return this;
};

IB.prototype.cancelAccountUpdatesMulti = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('cancelAccountUpdatesMulti', reqId);

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

IB.prototype.reqAccountUpdatesMulti = function (reqId, acctCode, modelCode, ledgerAndNLV) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isString(acctCode), '"acctCode" must be a string - ' + acctCode);
  assert(_.isString(modelCode) || _.isNull(modelCode), '"modelCode" must be a string or null - ' + modelCode);
  assert(_.isBoolean(ledgerAndNLV), '"ledgerAndNLV" must be a boolean - ' + ledgerAndNLV);

  this._send('reqAccountUpdatesMulti', reqId, acctCode, modelCode, ledgerAndNLV);

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

IB.prototype.reqHeadTimestamp = function(reqId, contract, whatToShow, useRTH, formatDate) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(whatToShow), '"whatToShow" must be a string - ' + whatToShow);
  assert(_.isNumber(useRTH), '"useRTH" must be an integer - ' + useRTH);
  assert(_.isNumber(formatDate), '"formatDate" must be an integer - ' + formatDate);
  this._send('reqHeadTimestamp', reqId, contract, whatToShow, useRTH, formatDate);
};

IB.prototype.reqSecDefOptParams = function(reqId, underlyingSymbol, futFopExchange, underlyingSecType, underlyingConId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isString(underlyingSymbol), '"underlyingSymbol" must be a string - ' + underlyingSymbol);
  assert(_.isString(futFopExchange), '"futFopExchange" must be a string - ' + futFopExchange);
  assert(_.isString(futFopExchange), '"underlyingSecType" must be a string - ' + underlyingSecType);
  assert(_.isNumber(underlyingConId), '"underlyingConId" must be an integer - ' + underlyingConId);

  this._send('reqSecDefOptParams', reqId, underlyingSymbol, futFopExchange, underlyingSecType, underlyingConId);
  return this;
};

IB.prototype.reqHistoricalData = function (tickerId, contract, endDateTime, durationStr,
                                           barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(endDateTime), '"endDateTime" must be a string - ' + endDateTime);
  assert(_.isString(durationStr), '"durationStr" must be a string - ' + durationStr);
  assert(_.isString(barSizeSetting), '"barSizeSetting" must be a string - ' + barSizeSetting);
  assert(_.isString(whatToShow), '"whatToShow" must be a string - ' + whatToShow);
  assert(_.isNumber(useRTH), '"useRTH" must be an integer - ' + useRTH);
  assert(_.isNumber(formatDate), '"formatDate" must be an integer - ' + formatDate);
  assert(_.isBoolean(keepUpToDate), '"keepUpToDate" must be an boolean - ' + keepUpToDate);

  this._send('reqHistoricalData', tickerId, contract, endDateTime, durationStr,
                                     barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate);

  return this;
};

IB.prototype.reqHistoricalTicks = function (tickerId, contract, startDateTime, endDateTime, numberOfTicks,
                                whatToShow, useRTH, ignoreSize){
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  if (startDateTime && endDateTime || !startDateTime && !endDateTime) {
    assert.fail('specify one of "startDateTime" or "endDateTime" (as a string) but not both - ' + startDateTime + ':' + endDateTime);
  }
  assert(_.isNumber(numberOfTicks), '"numberOfTicks" must be a number - ' + numberOfTicks);
  assert(_.isString(whatToShow), '"whatToShow" must be a string - ' + whatToShow);
  assert(_.isNumber(useRTH), '"useRTH" must be an integer - ' + useRTH);
  assert(_.isBoolean(ignoreSize), '"ignoreSize" must be an boolean - ' + ignoreSize);
  
  this._send('reqHistoricalTicks', tickerId, contract, startDateTime, endDateTime, numberOfTicks, 
                                    whatToShow, useRTH, ignoreSize);
  
  return this;
};

IB.prototype.reqTickByTickData = function (tickerId, contract, tickType, numberOfTicks, ignoreSize) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(tickType), '"tickType" must be a string - ' + tickType);
  assert(_.isNumber(numberOfTicks), '"numberOfTicks" must be a number - ' + numberOfTicks);
  assert(_.isBoolean(ignoreSize), '"ignoreSize" must be an boolean - ' + ignoreSize);

  this._send('reqTickByTickData', tickerId, contract, tickType, numberOfTicks, ignoreSize);

  return this;
};

IB.prototype.cancelTickByTickData = function (tickerId) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);

  this._send('cancelTickByTickData', tickerId);
  
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

IB.prototype.reqMktData = function (tickerId, contract, genericTickList, snapshot, regulatorySnapshot) {
  assert(_.isNumber(tickerId), '"tickerId" must be an integer - ' + tickerId);
  assert(_.isPlainObject(contract), '"contract" must be a plain object - ' + contract);
  assert(_.isString(genericTickList), '"genericTickList" must be a string - ' + genericTickList);
  assert(_.isBoolean(snapshot), '"snapshot" must be a boolean - ' + snapshot);
  assert(_.isBoolean(regulatorySnapshot), '"regulatorySnapshot" must be a boolean - ' + regulatorySnapshot);

  this._send('reqMktData', tickerId, contract, genericTickList, snapshot, regulatorySnapshot);

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

// input params account here is acctCode, we name it account to be consistent with IB document
IB.prototype.reqPositionsMulti = function (reqId, account, modelCode) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isString(account), '"account" must be a string - ' + account);
  assert(_.isString(modelCode) || _.isNull(modelCode), '"modelCode" must be a string or null - ' + modelCode);

  this._send('reqPositionsMulti', reqId, account, modelCode);

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

IB.prototype.queryDisplayGroups = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('queryDisplayGroups', reqId);

  return this;
};

IB.prototype.updateDisplayGroup = function (reqId, contractInfo) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isString(contractInfo), '"contractInfo" must be an string - ' + contractInfo);

  this._send('updateDisplayGroup', reqId, contractInfo);

  return this;
};

IB.prototype.subscribeToGroupEvents = function (reqId, groupId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);
  assert(_.isString(groupId), '"groupId" must be an integer - ' + groupId);

  this._send('subscribeToGroupEvents', reqId, groupId);

  return this;
};

IB.prototype.unsubscribeToGroupEvents = function (reqId) {
  assert(_.isNumber(reqId), '"reqId" must be an integer - ' + reqId);

  this._send('unsubscribeToGroupEvents', reqId);

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
IB.contract = IB.prototype.contract = require('./contract');
IB.order = IB.prototype.order = require('./order');
IB.util = IB.prototype.util = require('./util');

module.exports = IB;
