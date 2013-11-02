/*
 * lib/incoming.js
 */

'use strict';

var util = require('util');

var _ = require('lodash');

var C = require('./constants');

function Incoming(controller) {
  this._controller = controller;

  this._dataQueue = [];
}

Incoming.prototype._ACCT_DOWNLOAD_END = function () {
  var version = this.dequeueInt(),
      accountName = this.dequeue();

  this._controller.emit('accountDownloadEnd', accountName);
};

Incoming.prototype._ACCOUNT_SUMMARY = function () {
  var version = this.dequeueInt(),
      reqId = this.dequeueInt(),
      account = this.dequeue(),
      tag = this.dequeue(),
      value = this.dequeue(),
      currency = this.dequeue();

  this._controller.emit('accountSummary', reqId, account, tag, value, currency);
};

Incoming.prototype._ACCOUNT_SUMMARY_END = function () {
  var version = this.dequeueInt(),
      reqId = this.dequeueInt();

  this._controller.emit('accountSummaryEnd', reqId);
};

Incoming.prototype._ACCT_UPDATE_TIME = function () {
  var version = this.dequeueInt(),
      timeStamp = this.dequeue();

  this._controller.emit('updateAccountTime', timeStamp);
};

Incoming.prototype._ACCT_VALUE = function () {
  var version = this.dequeueInt(),
      key = this.dequeue(),
      val  = this.dequeue(),
      cur = this.dequeue(),
      accountName = null;

  if (version >= 2) {
    accountName = this.dequeue();
  }

  this._controller.emit('updateAccountValue', key, val, cur, accountName);
};

Incoming.prototype._CONTRACT_DATA = function () {
  var version = this.dequeueInt(),
      reqId = -1;

  if (version >= 3) {
    reqId = this.dequeueInt();
  }

  var contract = {
    summary: {}
  };

  contract.summary.symbol = this.dequeue();
  contract.summary.secType = this.dequeue();
  contract.summary.expiry = this.dequeue();
  contract.summary.strike = this.dequeueFloat();
  contract.summary.right = this.dequeue();
  contract.summary.exchange = this.dequeue();
  contract.summary.currency = this.dequeue();
  contract.summary.localSymbol = this.dequeue();
  contract.marketName = this.dequeue();
  contract.summary.tradingClass = this.dequeue();
  contract.summary.conId = this.dequeueInt();
  contract.minTick = this.dequeueFloat();
  contract.summary.multiplier = this.dequeue();
  contract.orderTypes = this.dequeue();
  contract.validExchanges = this.dequeue();

  if (version >= 2) {
    contract.priceMagnifier = this.dequeueInt();
  }

  if (version >= 4) {
    contract.underConId = this.dequeueInt();
  }

  if (version >= 5) {
    contract.longName = this.dequeue();
    contract.summary.primaryExch = this.dequeue();
  }

  if (version >= 6) {
    contract.contractMonth = this.dequeue();
    contract.industry = this.dequeue();
    contract.category = this.dequeue();
    contract.subcategory = this.dequeue();
    contract.timeZoneId = this.dequeue();
    contract.tradingHours = this.dequeue();
    contract.liquidHours = this.dequeue();
  }

  if (version >= 8) {
    contract.evRule = this.dequeue();
    contract.evMultiplier = this.dequeueFloat();
  }

  var secIdListCount,
      tagValue,
      i;

  if (version >= 7) {
    secIdListCount = this.dequeueInt();
    if (secIdListCount  > 0) {
      contract.secIdList = [];
      for (i = 0; i < secIdListCount; ++i) {
        tagValue = {};
        tagValue.tag = this.dequeue();
        tagValue.value = this.dequeue();
        contract.secIdList.push(tagValue);
      }
    }
  }

  this._controller.emit('contractDetails', reqId, contract);
};

Incoming.prototype._CONTRACT_DATA_END = function () {
  var version = this.dequeueInt(),
      reqId = this.dequeueInt();

  this._controller.emit('contractDetailsEnd', reqId);
};

Incoming.prototype._CURRENT_TIME = function () {
  var version = this.dequeueInt(),
      time = this.dequeueInt();

  this._controller.emit('currentTime', time);
};

Incoming.prototype._ERR_MSG = function () {
  var errorCode,
      errorMsg,
      id,
      version = this.dequeueInt();

  if (version < 2) {
    errorMsg = this.dequeue();
    this._controller.emitError(errorMsg);
  } else {
    id = this.dequeueInt();
    errorCode = this.dequeueInt();
    errorMsg = this.dequeue();
    this._controller.emitError(errorMsg, {
      id: id,
      code: errorCode
    });
  }
};

Incoming.prototype._EXECUTION_DATA = function () {
  var version = this.dequeueInt();

  var reqId = -1;

  if (version >= 7) {
    reqId = this.dequeueInt();
  }

  var orderId = this.dequeueInt();

  // read contract fields
  var contract = {};

  if (version >= 5) {
    contract.conId = this.dequeueInt();
  }

  contract.symbol = this.dequeue();
  contract.secType = this.dequeue();
  contract.expiry = this.dequeue();
  contract.strike = this.dequeueFloat();
  contract.right = this.dequeue();

  if (version >= 9) {
    contract.multiplier = this.dequeue();
  }

  contract.exchange = this.dequeue();
  contract.currency = this.dequeue();
  contract.localSymbol = this.dequeue();

  if (version >= 10) {
    contract.tradingClass = this.dequeue();
  }

  var exec = {};

  exec.orderId = orderId;
  exec.execId = this.dequeue();
  exec.time = this.dequeue();
  exec.acctNumber = this.dequeue();
  exec.exchange = this.dequeue();
  exec.side = this.dequeue();
  exec.shares = this.dequeue();
  exec.price = this.dequeueFloat();

  if (version >= 2) {
    exec.permId = this.dequeueInt();
  }

  if (version >= 3) {
    exec.clientId = this.dequeueInt();
  }

  if (version >= 4) {
    exec.liquidation = this.dequeueInt();
  }

  if (version >= 6) {
    exec.cumQty = this.dequeueInt();
    exec.avgPrice = readDouble();
  }

  if (version >= 8) {
    exec.orderRef = this.dequeue();
  }

  if (version >= 9) {
    exec.evRule = this.dequeue();
    exec.evMultiplier = this.dequeueFloat();
  }

  this._controller.emit('execDetails', reqId, contract, exec);
};

Incoming.prototype._EXECUTION_DATA_END = function () {
  var version = this.dequeueInt(),
      reqId = this.dequeueInt();

  this._controller.emit('execDetailsEnd', reqId);
};

Incoming.prototype._MANAGED_ACCTS = function () {
  var version = this.dequeueInt(),
      accountsList = this.dequeue();

  this._controller.emit('managedAccounts', accountsList);
};

Incoming.prototype._NEWS_BULLETINS = function () {
  var version = this.dequeueInt(),
      newsMsgId = this.dequeueInt(),
      newsMsgType = this.dequeueInt(),
      newsMessage = this.dequeue(),
      originatingExch = this.dequeue();

  this._controller.emit('updateNewsBulletin', newsMsgId, newsMsgType, newsMessage, originatingExch);
};

Incoming.prototype._NEXT_VALID_ID = function () {
  var version = this.dequeueInt(),
      orderId = this.dequeueInt();

  this._controller.emit('nextValidId', orderId);
};

Incoming.prototype._OPEN_ORDER_END = function () {
  var version = this.dequeueInt();

  this._controller.emit('openOrderEnd');
};

Incoming.prototype._PORTFOLIO_VALUE = function () {
  var version = this.dequeueInt();

  var contract = {};

  if (version >= 6) {
    contract.conId = this.dequeueInt();
  }

  contract.symbol = this.dequeue();
  contract.secType = this.dequeue();
  contract.expiry = this.dequeue();
  contract.strike = this.dequeueFloat();
  contract.right = this.dequeue();

  if (version >= 7) {
    contract.multiplier = this.dequeue();
    contract.primaryExch = this.dequeue();
  }

  contract.currency = this.dequeue();

  if (version >= 2) {
    contract.localSymbol = this.dequeue();
  }

  if (version >= 8) {
    contract.tradingClass = this.dequeue();
  }

  var position = this.dequeueInt(),
      marketPrice = this.dequeueFloat(),
      marketValue = this.dequeueFloat(),
      averageCost = 0.0,
      unrealizedPNL = 0.0,
      realizedPNL = 0.0;

  if (version >= 3) {
    averageCost = this.dequeueFloat();
    unrealizedPNL = this.dequeueFloat();
    realizedPNL = this.dequeueFloat();
  }

  var accountName = null;

  if (version >= 4) {
    accountName = this.dequeue();
  }

  if (version === 6 && this._controller._serverVersion === 39) {
    contract.primaryExch = this.dequeue();
  }

  this._controller.emit('updatePortfolio', contract, position, marketPrice, marketValue,
                                           averageCost, unrealizedPNL, realizedPNL, accountName);
};

Incoming.prototype._POSITION = function () {
  var version = this.dequeueInt(),
      account = this.dequeue(),
      contract = {};

  contract.conId = this.dequeueInt();
  contract.symbol = this.dequeue();
  contract.secType = this.dequeue();
  contract.expiry = this.dequeue();
  contract.strike = this.dequeueFloat();
  contract.right = this.dequeue();
  contract.multiplier = this.dequeue();
  contract.exchange = this.dequeue();
  contract.currency = this.dequeue();
  contract.localSymbol = this.dequeue();
  if (version >= 2) {
    contract.tradingClass = this.dequeue();
  }

  var pos = this.dequeueInt(),
      avgCost = 0;
  if (version >= 3) {
    avgCost = this.dequeueFloat();
  }

  this._controller.emit('position', account, contract, pos, avgCost);
};

Incoming.prototype._POSITION_END = function () {
  var version = this.dequeueInt();

  this._controller.emit('positionEnd');
};

Incoming.prototype._RECEIVE_FA = function () {
  var version = this.dequeueInt(),
      faDataType = this.dequeueInt(),
      xml = this.dequeue();

  this._controller.emit('receiveFA', faDataType, xml);
};

Incoming.prototype._SCANNER_DATA = function () {
  var version = this.dequeueInt(),
      tickerId = this.dequeueInt(),
      numberOfElements = this.dequeueInt();

  var contract = {
    summary: {}
  };

  var rank;

  while (numberOfElements--) {
    rank = this.dequeueInt();

    if (version >= 3) {
      contract.summary.conId = this.dequeueInt();
    }

    contract.summary.symbol = this.dequeue();
    contract.summary.secType = this.dequeue();
    contract.summary.expiry = this.dequeue();
    contract.summary.strike = this.dequeueFloat();
    contract.summary.right = this.dequeue();
    contract.summary.exchange = this.dequeue();
    contract.summary.currency = this.dequeue();
    contract.summary.localSymbol = this.dequeue();
    contract.marketName = this.dequeue();
    contract.summary.tradingClass = this.dequeue();

    var distance = this.dequeue(),
        benchmark = this.dequeue(),
        projection = this.dequeue(),
        legsStr = null;

    if (version >= 2) {
      legsStr = this.dequeue();
    }

    this._controller.emit('scannerData', tickerId, rank, contract, distance,
                                         benchmark, projection, legsStr);
  }

  this._controller.emit('scannerDataEnd', tickerId);
};

Incoming.prototype._SCANNER_PARAMETERS = function () {
  var version = this.dequeueInt(),
      xml = this.dequeue();

  this._controller.emit('scannerParameters', xml);
};

Incoming.prototype._TICK_GENERIC = function () {
  var version = this.dequeueInt(),
      tickerId = this.dequeueInt(),
      tickType = this.dequeueInt(),
      value = this.dequeueFloat();

  this._controller.emit('tickGeneric', tickerId, tickType, value);
};

Incoming.prototype._TICK_PRICE = function () {
  var version = this.dequeueInt(),
      tickerId = this.dequeueInt(),
      tickType = this.dequeueInt(),
      price = this.dequeueFloat(),
      size = 0;

  if (version >= 2) {
    size = this.dequeueInt();
  }

  var canAutoExecute = 0;

  if (version >= 3) {
    canAutoExecute = this.dequeueInt();
  }

  this._controller.emit('tickPrice', tickerId, tickType, price, canAutoExecute);

  var sizeTickType = -1;

  if (version >= 2) {
    sizeTickType = -1 ; // not a tick

    switch (tickType) {
    case 1:  // BID
      sizeTickType = 0;  // BID_SIZE
      break;
    case 2:  // ASK
      sizeTickType = 3;  // ASK_SIZE
      break;
    case 4:  // LAST
      sizeTickType = 5;  // LAST_SIZE
      break;
    default:
      break;
    }

    if (sizeTickType != -1) {
      this._controller.emit('tickSize', tickerId, sizeTickType, size);
    }
  }
};

Incoming.prototype._TICK_SIZE = function () {
  var version = this.dequeueInt(),
      tickerId = this.dequeueInt(),
      tickType = this.dequeueInt(),
      size = this.dequeueInt();

  this._controller.emit('tickSize', tickerId, tickType, size);
};

Incoming.prototype._TICK_STRING = function () {
  var version = this.dequeueInt(),
      tickerId = this.dequeueInt(),
      tickType = this.dequeueInt(),
      value = this.dequeue();

  this._controller.emit('tickString', tickerId, tickType, value);
};

Incoming.prototype.dequeue = function () {
  return this._dataQueue.shift();
};

Incoming.prototype.dequeueFloat = function () {
  return parseFloat(this.dequeue());
};

Incoming.prototype.dequeueInt = function () {
  return parseInt(this.dequeue(), 10);
};

Incoming.prototype.enqueue = function (tokens) {
  this._dataQueue = this._dataQueue.concat(tokens);
};

Incoming.prototype.process = function () {
  var constKey,
      token;

  while (token = this.dequeueInt()) {
    constKey = this._controller.findKeyForValue(C.INCOMING, token);
    if (constKey && _.has(this.constructor.prototype, '_' + constKey) && _.isFunction(this['_' + constKey])) {
      this['_' + constKey]();
    } else {
      console.error(util.format('Unknown incoming first token: %s', token).red);
    }
  }
};

// Public API
module.exports = exports = Incoming;
