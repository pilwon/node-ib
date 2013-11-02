/*
 * lib/outgoing.js
 */

'use strict';

var _ = require('lodash');

var C = require('./constants');

function Outgoing(controller) {
  this._controller = controller;
}

Outgoing.prototype._send = function () {
  var args = Array.prototype.slice.call(arguments);
  this._controller.run('send', _.flatten(args));
};

Outgoing.prototype.calculateImpliedVolatility = function (reqId, contract, optionPrice, underPrice) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.REQ_CALC_IMPLIED_VOLAT) {
    return this._controller.emitError('It does not support calculate implied volatility requests.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass)) {
      return this._controller.emitError('It does not support tradingClass parameter in calculateImpliedVolatility.');
    }
  }

  var version = 2;

  var args = [C.OUTGOING.REQ_CALC_IMPLIED_VOLAT, version, reqId];

  // send contract fields
  args.push(contract.conId);
  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);
  args.push(contract.multiplier);
  args.push(contract.exchange);
  args.push(contract.primaryExch);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  args.push(optionPrice);
  args.push(underPrice);

  this._send(args);
};

Outgoing.prototype.calculateOptionPrice = function (reqId, contract, volatility, underPrice) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.REQ_CALC_OPTION_PRICE) {
    return this._controller.emitError('It does not support calculate option price requests.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass)) {
      return this._controller.emitError('It does not support tradingClass parameter in calculateOptionPrice.');
    }
  }

  var version = 2;

  var args = [C.OUTGOING.REQ_CALC_OPTION_PRICE, version, reqId];

  // send contract fields
  args.push(contract.conId);
  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);
  args.push(contract.multiplier);
  args.push(contract.exchange);
  args.push(contract.primaryExch);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  args.push(volatility);
  args.push(underPrice);

  this._send(args);
};

Outgoing.prototype.cancelAccountSummary = function (reqId) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.ACCT_SUMMARY) {
    return this._controller.emitError('It does not support account summary cancellation.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_ACCOUNT_SUMMARY, version, reqId);
};

Outgoing.prototype.cancelCalculateImpliedVolatility = function (reqId) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.CANCEL_CALC_IMPLIED_VOLAT) {
    return this._controller.emitError('It does not support calculate implied volatility cancellation.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_CALC_IMPLIED_VOLAT, version, reqId);
};

Outgoing.prototype.cancelCalculateOptionPrice = function (reqId) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.CANCEL_CALC_OPTION_PRICE) {
    return this._controller.emitError('It does not support calculate option price cancellation.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_CALC_OPTION_PRICE, version, reqId);
};

Outgoing.prototype.cancelFundamentalData = function (reqId) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.FUNDAMENTAL_DATA) {
    return this._controller.emitError('It does not support fundamental data requests.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_FUNDAMENTAL_DATA, version, reqId);
};

Outgoing.prototype.cancelHistoricalData = function (tickerId) {
  if (this._controller._serverVersion < 24) {
    return this._controller.emitError('It does not support historical data query cancellation.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_HISTORICAL_DATA, version, tickerId);
};

Outgoing.prototype.cancelMktData = function (tickerId) {
  var version = 1;

  this._send(C.OUTGOING.CANCEL_MKT_DATA, version, tickerId);
};

Outgoing.prototype.cancelMktDepth = function (tickerId) {
  if (this._controller._serverVersion < 6) {
    return this._controller.emitError('This feature is only available for versions of TWS >=6.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_MKT_DEPTH, version, tickerId);
};

Outgoing.prototype.cancelNewsBulletins = function () {
  var version = 1;

  this._send(C.OUTGOING.CANCEL_NEWS_BULLETINS, version);
};

Outgoing.prototype.cancelOrder = function (id) {
  var version = 1;

  this._send(C.OUTGOING.CANCEL_ORDER, version, id);
};

Outgoing.prototype.cancelPositions = function () {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.ACCT_SUMMARY) {
    return this._controller.emitError('It does not support position cancellation.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_POSITIONS, version);
};

Outgoing.prototype.cancelRealTimeBars = function (tickerId) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.REAL_TIME_BARS) {
    return this._controller.emitError('It does not support realtime bar data query cancellation.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_REAL_TIME_BARS, version, tickerId);
};

Outgoing.prototype.cancelScannerSubscription = function (tickerId) {
  if (this._controller._serverVersion < 24) {
    return this._controller.emitError('It does not support API scanner subscription.');
  }

  var version = 1;

  this._send(C.OUTGOING.CANCEL_SCANNER_SUBSCRIPTION, version, tickerId);
};

Outgoing.prototype.exerciseOptions = function (tickerId, contract, exerciseAction, exerciseQuantity,
                                               account, override) {
  var version = 2;

  if (this._controller._serverVersion < 21) {
    return this._controller.emitError('It does not support options exercise from the API.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass) || contract.conId > 0) {
      return this._controller.emitError('It does not support conId and tradingClass parameters in exerciseOptions.');
    }
  }

  var args = [C.OUTGOING.EXERCISE_OPTIONS, version, tickerId];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.conId);
  }

  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);
  args.push(contract.multiplier);
  args.push(contract.exchange);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  args.push(exerciseAction);
  args.push(exerciseQuantity);
  args.push(account);
  args.push(override);

  this._send(args);
};

Outgoing.prototype.placeOrder = function (id, contract, order) {
  throw new Error('"placeOrder" is not yet implemented.');
};

Outgoing.prototype.replaceFA = function (faDataType, xml) {
  if (this._controller._serverVersion < 13) {
    return this._controller.emitError('This feature is only available for versions of TWS >= 13.');
  }

  var version = 1;

  this._send(C.OUTGOING.REPLACE_FA, version, faDataType, xml);
};

Outgoing.prototype.reqAccountSummary = function (reqId, group, tags) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.ACCT_SUMMARY) {
    return this._controller.emitError('It does not support account summary requests.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_ACCOUNT_SUMMARY, version, reqId, group, tags);
};

Outgoing.prototype.reqAccountUpdates = function (subscribe, acctCode) {
  var version = 2;

  if (this._controller._serverVersion >= 9) {
    this._send(C.OUTGOING.REQ_ACCOUNT_DATA, version, subscribe, acctCode);
  } else {
    this._send(C.OUTGOING.REQ_ACCOUNT_DATA, version, subscribe);
  }
};

Outgoing.prototype.reqAllOpenOrders = function () {
  var version = 1;

  this._send(C.OUTGOING.REQ_ALL_OPEN_ORDERS, version);
};

Outgoing.prototype.reqAutoOpenOrders = function (bAutoBind) {
  var version = 1;

  this._send(C.OUTGOING.REQ_AUTO_OPEN_ORDERS, version, bAutoBind);
};

Outgoing.prototype.reqContractDetails = function (reqId, contract) {
  if (this._controller._serverVersion < 4) {
    return this._controller.emitError('This feature is only available for versions of TWS >=4');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SEC_ID_TYPE) {
    if (!_.isEmpty(contract.secIdType) || !_.isEmpty(contract.secId)) {
      return this._controller.emitError('It does not support secIdType and secId parameters.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass)) {
      return this._controller.emitError('It does not support tradingClass parameter in reqContractDetails.');
    }
  }

  var version = 7;

  // send req mkt data msg
  var args = [C.OUTGOING.REQ_CONTRACT_DATA, version];

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.CONTRACT_DATA_CHAIN) {
    args.push(reqId);
  }

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.CONTRACT_CONID) {
    args.push(contract.conId);
  }

  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);

  if (this._controller._serverVersion >= 15) {
    args.push(contract.multiplier);
  }

  args.push(contract.exchange);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  if (this._controller._serverVersion >= 31) {
    args.push(contract.includeExpired);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SEC_ID_TYPE) {
    args.push(contract.secIdType);
    args.push(contract.secId);
  }

  this._send(args);
};

Outgoing.prototype.reqCurrentTime = function () {
  if (this._controller._serverVersion < 33) {
    return this._controller.emitError('It does not support current time requests.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_CURRENT_TIME, version);
};

Outgoing.prototype.reqExecutions = function (reqId, filter) {
  // NOTE: Time format must be 'yyyymmdd-hh:mm:ss' E.g. '20030702-14:55'

  var version = 3;

  // send req open orders msg
  var args = [C.OUTGOING.REQ_EXECUTIONS, version];

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.EXECUTION_DATA_CHAIN) {
    args.push(reqId);
  }

  // Send the execution rpt filter data (srv v9 and above)
  args.push(filter.clientId);
  args.push(filter.acctCode);
  args.push(filter.time);
  args.push(filter.symbol);
  args.push(filter.secType);
  args.push(filter.exchange);
  args.push(filter.side);

  this._send(args);
};

Outgoing.prototype.reqFundamentalData = function (reqId, contract, reportType) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.FUNDAMENTAL_DATA) {
    return this._controller.emitError('It does not support fundamental data requests.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (contract.conId > 0) {
      return this._controller.emitError('It does not support conId parameter in reqFundamentalData.');
    }
  }

  var version = 2;

  // send req fund data msg
  var args = [C.OUTGOING.REQ_FUNDAMENTAL_DATA, version, reqId];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.conId);
  }

  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.exchange);
  args.push(contract.primaryExch);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  args.push(reportType);

  this._send(args);
};

Outgoing.prototype.reqGlobalCancel = function () {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.REQ_GLOBAL_CANCEL) {
    return this._controller.emitError('It does not support globalCancel requests.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_GLOBAL_CANCEL, version);
};

Outgoing.prototype.reqHistoricalData = function (tickerId, contract, endDateTime, durationStr,
                                                 barSizeSetting, whatToShow, useRTH, formatDate) {
  var version = 5;

  if (this._controller._serverVersion < 16) {
    return this._controller.emitError('It does not support historical data backfill.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass) || contract.conId > 0) {
      return this._controller.emitError('It does not support conId and tradingClass parameters in reqHistroricalData.');
    }
  }

  var args = [C.OUTGOING.REQ_HISTORICAL_DATA, version, tickerId];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.conId);
  }

  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);
  args.push(contract.multiplier);
  args.push(contract.exchange);
  args.push(contract.primaryExch);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  if (this._controller._serverVersion >= 31) {
    args.push(!!contract.includeExpired);
  }

  if (this._controller._serverVersion >= 20) {
    args.push(endDateTime);
    args.push(barSizeSetting);
  }

  args.push(durationStr);
  args.push(useRTH);
  args.push(whatToShow);

  if (this._controller._serverVersion > 16) {
    args.push(formatDate);
  }

  var comboLeg;

  if (_.isString(contrast.secType) &&
      C.BAG_SEC_TYPE.toUpperCase() === contract.secType.toUpperCase()) {
    if (!_.isArray(contract.comboLegs)) {
      args.push(0);
    } else {
      args.push(contract.comboLegs.length);

      contract.comboLegs.forEach(function (comboLeg) {
        args.push(comboLeg.conId);
        args.push(comboLeg.ratio);
        args.push(comboLeg.action);
        args.push(comboLeg.exchange);
      });
    }
  }

  this._send(args);
};

Outgoing.prototype.reqIds = function (numIds) {
  var version = 1;

  this._send(C.OUTGOING.REQ_IDS, version, numIds);
};

Outgoing.prototype.reqManagedAccts = function () {
  var version = 1;

  this._send(C.OUTGOING.REQ_MANAGED_ACCTS, version);
};

Outgoing.prototype.reqMarketDataType = function (marketDataType) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.REQ_MARKET_DATA_TYPE) {
    return this._controller.emitError('It does not support marketDataType requests.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_MARKET_DATA_TYPE, version, marketDataType);
};

Outgoing.prototype.reqMktData = function (tickerId, contract, genericTickList, snapshot) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.SNAPSHOT_MKT_DATA && snapshot) {
    return this._controller.emitError('It does not support snapshot market data requests.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.UNDER_COMP) {
    return this._controller.emitError('It does not support delta-neutral orders.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.REQ_MKT_DATA_CONID) {
    return this._controller.emitError('It does not support conId parameter.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass)) {
      return this._controller.emitError('It does not support tradingClass parameter in reqMarketData.');
    }
  }

  var version = 10;

  var args = [C.OUTGOING.REQ_MKT_DATA, version, tickerId];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.REQ_MKT_DATA_CONID) {
    args.push(contract.conId);
  }
  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);

  if (this._controller._serverVersion >= 15) {
    args.push(contract.multiplier);
  }

  args.push(contract.exchange);

  if (this._controller._serverVersion >= 14) {
    args.push(contract.primaryExch);
  }

  args.push(contract.currency);

  if (this._controller._serverVersion >= 2) {
    args.push(contract.localSymbol);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  if (this._controller._serverVersion >= 8 &&
      _.isString(contract.secType) &&
      C.BAG_SEC_TYPE.toUpperCase() === contract.secType.toUpperCase()) {
    if (!_.isArray(contract.comboLegs)) {
      args.push(0);
    } else {
      args.push(contract.comboLegs.length);
      contract.comboLegs.forEach(function (comboLeg) {
        args.push(comboLeg.conId);
        args.push(comboLeg.ratio);
        args.push(comboLeg.action);
        args.push(comboLeg.exchange);
      });
    }
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.UNDER_COMP) {
    if (_.isPlainObject(contract.underComp)) {
      args.push(true);
      args.push(contract.underComp.conId);
      args.push(contract.underComp.delta);
      args.push(contract.underComp.price);
    } else {
      args.push(false);
    }
  }

  if (this._controller._serverVersion >= 31) {
    /*
     * Note: Even though SHORTABLE tick type supported only
     *       starting server version 33 it would be relatively
     *       expensive to expose this restriction here.
     *
     *       Therefore we are relying on TWS doing validation.
     */
    args.push(genericTickList);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SNAPSHOT_MKT_DATA) {
    args.push(snapshot);
  }

  this._send(args);
};

Outgoing.prototype.reqMktDepth = function (tickerId, contract, numRows) {
  if (this._controller._serverVersion < 6) {
      return this._controller.emitError('This feature is only available for versions of TWS >=6');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass) || contract.conId > 0) {
      return this._controller.emitError('It does not support conId and tradingClass parameters in reqMktDepth.');
    }
  }

  var version = 4;

  // send req mkt data msg
  var args = [C.OUTGOING.REQ_MKT_DEPTH, version, tickerId];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.conId);
  }

  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);

  if (this._controller._serverVersion >= 15) {
    args.push(contract.multiplier);
  }

  args.push(contract.exchange);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  if (this._controller._serverVersion >= 19) {
    args.push(numRows);
  }

  this._send(args);
};

Outgoing.prototype.reqNewsBulletins = function (allMsgs) {
  var version = 1;

  this._send(C.OUTGOING.REQ_NEWS_BULLETINS, version, allMsgs);
};

Outgoing.prototype.reqOpenOrders = function () {
  var version = 1;

  this._send(C.OUTGOING.REQ_OPEN_ORDERS, version);
};

Outgoing.prototype.reqPositions = function () {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.ACCT_SUMMARY) {
    return this._controller.emitError('It does not support position requests.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_POSITIONS, version);
};

Outgoing.prototype.reqRealTimeBars = function (tickerId, contract, barSize, whatToShow, useRTH) {
  if (this._controller._serverVersion < C.MIN_SERVER_VER.REAL_TIME_BARS) {
    return this._controller.emitError('It does not support real time bars.');
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass) || contract.conId > 0) {
      return this._controller.emitError('It does not support conId and tradingClass parameters in reqRealTimeBars.');
    }
  }

  var version = 2;

  // send req mkt data msg
  var args = [C.OUTGOING.REQ_REAL_TIME_BARS, version, tickerId];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.conId);
  }

  args.push(contract.symbol);
  args.push(contract.secType);
  args.push(contract.expiry);
  args.push(contract.strike);
  args.push(contract.right);
  args.push(contract.multiplier);
  args.push(contract.exchange);
  args.push(contract.primaryExch);
  args.push(contract.currency);
  args.push(contract.localSymbol);

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRADING_CLASS) {
    args.push(contract.tradingClass);
  }

  args.push(barSize);  // this parameter is not currently used
  args.push(whatToShow);
  args.push(useRTH);

  this._send(args);
};

Outgoing.prototype.reqScannerParameters = function () {
  if (this._controller._serverVersion < 24) {
    return this._controller.emitError('It does not support API scanner subscription.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_SCANNER_PARAMETERS, version);
};

Outgoing.prototype.reqScannerSubscription = function (tickerId, subscription) {
  if (this._controller._serverVersion < 24) {
    return this._controller.emitError('It does not support API scanner subscription.');
  }

  var version = 3;

  var args = [C.OUTGOING.REQ_SCANNER_SUBSCRIPTION, version, tickerId];

  args.push(subscription.numberOfRows);
  args.push(subscription.instrument);
  args.push(subscription.locationCode);
  args.push(subscription.scanCode);
  args.push(subscription.abovePrice);
  args.push(subscription.belowPrice);
  args.push(subscription.aboveVolume);
  args.push(subscription.marketCapAbove);
  args.push(subscription.marketCapBelow);
  args.push(subscription.moodyRatingAbove);
  args.push(subscription.moodyRatingBelow);
  args.push(subscription.spRatingAbove);
  args.push(subscription.spRatingBelow);
  args.push(subscription.maturityDateAbove);
  args.push(subscription.maturityDateBelow);
  args.push(subscription.couponRateAbove);
  args.push(subscription.couponRateBelow);
  args.push(subscription.excludeConvertible);

  if (this._controller._serverVersion >= 25) {
    args.push(subscription.averageOptionVolumeAbove);
    args.push(subscription.scannerSettingPairs);
  }

  if (this._controller._serverVersion >= 27) {
    args.push(subscription.stockTypeFilter);
  }

  this._send(args);
};

Outgoing.prototype.requestFA = function (faDataType) {
  if (this._controller._serverVersion < 13) {
    return this._controller.emitError('This feature is only available for versions of TWS >= 13.');
  }

  var version = 1;

  this._send(C.OUTGOING.REQ_FA, version, faDataType);
};

Outgoing.prototype.setServerLogLevel = function (logLevel) {
  var version = 1;

  this._send(C.OUTGOING.SET_SERVER_LOGLEVEL, version, logLevel);
};

// Public API
module.exports = exports = Outgoing;
