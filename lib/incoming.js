var _ = require('lodash');

var C = require('./constants');
var errors = require('./errors');

function Incoming(controller) {
  this._controller = controller;

  this._dataQueue = [];
  this._emitQueue = [];
}

Incoming.prototype._ACCT_DOWNLOAD_END = function () {
  var version = this.dequeueInt();
  var accountName = this.dequeue();

  this._emit('accountDownloadEnd', accountName);
};

Incoming.prototype._ACCOUNT_UPDATE_MULTI_END = function () {
  var version = this.dequeueInt();
  var requestId = this.dequeue();

  this._emit('accountUpdateMultiEnd', requestId);
};

Incoming.prototype._ACCOUNT_SUMMARY = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var account = this.dequeue();
  var tag = this.dequeue();
  var value = this.dequeue();
  var currency = this.dequeue();

  this._emit('accountSummary', reqId, account, tag, value, currency);
};

Incoming.prototype._ACCOUNT_SUMMARY_END = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();

  this._emit('accountSummaryEnd', reqId);
};

Incoming.prototype._ACCT_UPDATE_TIME = function () {
  var version = this.dequeueInt();
  var timeStamp = this.dequeue();

  this._emit('updateAccountTime', timeStamp);
};

Incoming.prototype._ACCT_VALUE = function () {
  var version = this.dequeueInt();
  var key = this.dequeue();
  var value  = this.dequeue();
  var currency = this.dequeue();
  var accountName = null;

  if (version >= 2) {
    accountName = this.dequeue();
  }

  this._emit('updateAccountValue', key, value, currency, accountName);
};

Incoming.prototype._ACCOUNT_UPDATE_MULTI = function () {
  var version = this.dequeueInt();
  var requestId = this.dequeueInt();
  var account = this.dequeue();
  var modelCode = this.dequeue();
  var key = this.dequeue();
  var value  = this.dequeue();
  var currency = this.dequeue();

  this._emit('accountUpdateMulti', requestId, account, modelCode, key, value, currency);
};

Incoming.prototype._COMMISSION_REPORT = function () {
  var version = this.dequeueInt();

  var commissionReport = {};
  commissionReport.execId = this.dequeue();
  commissionReport.commission = this.dequeueFloat();
  commissionReport.currency = this.dequeue();
  commissionReport.realizedPNL = this.dequeueFloat();
  commissionReport.yield = this.dequeueFloat();
  commissionReport.yieldRedemptionDate = this.dequeueInt();

  this._emit('commissionReport', commissionReport);
};

Incoming.prototype._BOND_CONTRACT_DATA = function () {
  var version = this.dequeueInt();
  var reqId = -1;
  var i;

  if (version >= 3) {
    reqId = this.dequeueInt();
  }

  var contract = {
    summary: {}
  };

  contract.summary.symbol = this.dequeue();
  contract.summary.secType = this.dequeue();
  contract.cusip = this.dequeue();
  contract.coupon = this.dequeueFloat();
  contract.maturity = this.dequeue();
  contract.issueDate  = this.dequeue();
  contract.ratings = this.dequeue();
  contract.bondType = this.dequeue();
  contract.couponType = this.dequeue();
  contract.convertible = this.dequeueBool();
  contract.callable = this.dequeueBool();
  contract.putable = this.dequeueBool();
  contract.descAppend = this.dequeue();
  contract.summary.exchange = this.dequeue();
  contract.summary.currency = this.dequeue();
  contract.marketName = this.dequeue();
  contract.summary.tradingClass = this.dequeue();
  contract.summary.conId = this.dequeueInt();
  contract.minTick = this.dequeueFloat();
  contract.orderTypes = this.dequeue();
  contract.validExchanges = this.dequeue();

  if (version >= 2) {
    contract.nextOptionDate = this.dequeue();
    contract.nextOptionType = this.dequeue();
    contract.nextOptionPartial = this.dequeueBool();
    contract.notes = this.dequeue();
  }

  if(version >= 4) {
    contract.longName = this.dequeue();
  }

  if (version >= 6) {
    contract.evRule = this.dequeue();
    contract.evMultiplier = this.dequeueFloat();
  }

  var secIdListCount;
  var tagValue;

  if (version >= 5) {
    secIdListCount = this.dequeueInt();

    if (secIdListCount > 0) {
      contract.secIdList = [];

      while (secIdListCount--) {
        tagValue = {};
        tagValue.tag = this.dequeue();
        tagValue.value = this.dequeue();
        contract.secIdList.push(tagValue);
      }
    }
  }

  this._emit('bondContractDetails', reqId, contract);
};

Incoming.prototype._CONTRACT_DATA = function () {
  var version = this.dequeueInt();
  var reqId = -1;

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

  var secIdListCount;
  var tagValue;
  var i;

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

  this._emit('contractDetails', reqId, contract);
};

Incoming.prototype._CONTRACT_DATA_END = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();

  this._emit('contractDetailsEnd', reqId);
};

Incoming.prototype._CURRENT_TIME = function () {
  var version = this.dequeueInt();
  var time = this.dequeueInt();

  this._emit('currentTime', time);
};

Incoming.prototype._DELTA_NEUTRAL_VALIDATION = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();

  var underComp = {};
  underComp.conId = this.dequeueInt();
  underComp.delta = this.dequeueFloat();
  underComp.price = this.dequeueFloat();

  this._emit('deltaNeutralValidation', reqId, underComp);
};

Incoming.prototype._ERR_MSG = function () {
  var errorCode;
  var errorMsg;
  var id;
  var version = this.dequeueInt();

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
    exec.avgPrice = this.dequeueFloat();
  }

  if (version >= 8) {
    exec.orderRef = this.dequeue();
  }

  if (version >= 9) {
    exec.evRule = this.dequeue();
    exec.evMultiplier = this.dequeueFloat();
  }

  this._emit('execDetails', reqId, contract, exec);
};

Incoming.prototype._EXECUTION_DATA_END = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();

  this._emit('execDetailsEnd', reqId);
};

Incoming.prototype._FUNDAMENTAL_DATA = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var data = this.dequeue();

  this._emit('fundamentalData', reqId, data);
};

Incoming.prototype._HISTORICAL_DATA = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var completedIndicator = 'finished';
  var startDateStr;
  var endDateStr;

  if (version >= 2) {
    startDateStr = this.dequeue();
    endDateStr = this.dequeue();
    completedIndicator += '-' + startDateStr + '-' + endDateStr;
  }

  var itemCount = this.dequeueInt();
  var date;
  var open;
  var high;
  var low;
  var close;
  var volume;
  var WAP;
  var hasGaps;
  var barCount;

  while (itemCount--) {
    date = this.dequeue();
    open = this.dequeueFloat();
    high = this.dequeueFloat();
    low = this.dequeueFloat();
    close = this.dequeueFloat();
    volume = this.dequeueInt();
    WAP = this.dequeueFloat();
    hasGaps = this.dequeueBool();
    barCount = -1;

    if (version >= 3) {
      barCount = this.dequeueInt();
    }

    this._emit('historicalData', reqId, date, open, high, low, close, volume, barCount, WAP, hasGaps);
  }

  // send end of dataset marker
  this._emit('historicalData', reqId, completedIndicator, -1, -1, -1, -1, -1, -1, -1, false);
};

Incoming.prototype._HEAD_TIMESTAMP = function() {
  var reqId         = this.dequeueInt();
  var headTimestamp = this.dequeue();
  this._emit('headTimestamp', reqId, headTimestamp);

};

Incoming.prototype._MANAGED_ACCTS = function () {
  var version = this.dequeueInt();
  var accountsList = this.dequeue();

  this._emit('managedAccounts', accountsList);
};

Incoming.prototype._MARKET_DATA_TYPE = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var marketDataType = this.dequeueInt();

  this._emit('marketDataType', reqId, marketDataType);
};

Incoming.prototype._MARKET_DEPTH = function () {
  var version = this.dequeueInt();
  var id = this.dequeueInt();
  var position = this.dequeueInt();
  var operation = this.dequeueInt();
  var side = this.dequeueInt();
  var price = this.dequeueFloat();
  var size = this.dequeueInt();

  this._emit('updateMktDepth', id, position, operation, side, price, size);
};

Incoming.prototype._MARKET_DEPTH_L2 = function () {
  var version = this.dequeueInt();
  var id = this.dequeueInt();
  var position = this.dequeueInt();
  var marketMaker = this.dequeue();
  var operation = this.dequeueInt();
  var side = this.dequeueInt();
  var price = this.dequeueFloat();
  var size = this.dequeueInt();

  this._emit('updateMktDepthL2', id, position, marketMaker, operation, side, price, size);
};

Incoming.prototype._NEWS_BULLETINS = function () {
  var version = this.dequeueInt();
  var newsMsgId = this.dequeueInt();
  var newsMsgType = this.dequeueInt();
  var newsMessage = this.dequeue();
  var originatingExch = this.dequeue();

  this._emit('updateNewsBulletin', newsMsgId, newsMsgType, newsMessage, originatingExch);
};

Incoming.prototype._NEXT_VALID_ID = function () {
  var version = this.dequeueInt();
  var orderId = this.dequeueInt();

  this._emit('nextValidId', orderId);
};

Incoming.prototype._OPEN_ORDER = function () {
  var i;

  // read version
  var version = this.dequeueInt();

  // read order id
  var order = {};
  order.orderId = this.dequeueInt();

  // read contract fields
  var contract = {};

  if (version >= 17) {
    contract.conId = this.dequeueInt();
  }

  contract.symbol = this.dequeue();
  contract.secType = this.dequeue();
  contract.expiry = this.dequeue();
  contract.strike = this.dequeueFloat();
  contract.right = this.dequeue();

  if (version >= 32) {
    contract.multiplier = this.dequeue();
  }

  contract.exchange = this.dequeue();
  contract.currency = this.dequeue();

  if (version >= 2) {
    contract.localSymbol = this.dequeue();
  }

  if (version >= 32) {
    contract.tradingClass = this.dequeue();
  }

  // read order fields
  order.action = this.dequeue();
  order.totalQuantity = this.dequeueInt();
  order.orderType = this.dequeue();

  if (version < 29) {
    order.lmtPrice = this.dequeueFloat();
  } else {
    order.lmtPrice = this.dequeueFloat() || Number.MAX_VALUE;
  }

  if (version < 30) {
    order.auxPrice = this.dequeueFloat();
  } else {
    order.auxPrice = this.dequeueFloat() || Number.MAX_VALUE;
  }

  order.tif = this.dequeue();
  order.ocaGroup = this.dequeue();
  order.account = this.dequeue();
  order.openClose = this.dequeue();
  order.origin = this.dequeueInt();
  order.orderRef = this.dequeue();

  if (version >= 3) {
    order.clientId = this.dequeueInt();
  }

  if (version >= 4) {
    order.permId = this.dequeueInt();

    if (version < 18) {
      // will never happen
      /* order.ignoreRth = */ this.dequeueBool();
    } else {
      order.outsideRth = this.dequeueBool();
    }

    order.hidden = this.dequeueBool();
    order.discretionaryAmt = this.dequeueFloat();
  }

  if (version >= 5) {
    order.goodAfterTime = this.dequeue();
  }

  if (version >= 6) {
    // skip deprecated sharesAllocation field
    this.dequeue();
  }

  if (version >= 7) {
    order.faGroup = this.dequeue();
    order.faMethod = this.dequeue();
    order.faPercentage = this.dequeue();
    order.faProfile = this.dequeue();
  }

  if (version >= 8) {
    order.goodTillDate = this.dequeue();
  }

  if (version >= 9) {
    order.rule80A = this.dequeue();
    order.percentOffset = this.dequeueFloat() || Number.MAX_VALUE;
    order.settlingFirm = this.dequeue();
    order.shortSaleSlot = this.dequeueInt();
    order.designatedLocation = this.dequeue();

    if (this._controller._serverVersion === 51) {
      this.dequeueInt();  // exemptCode
    } else if (version >= 23) {
      order.exemptCode = this.dequeueInt();
    }

    order.auctionStrategy = this.dequeueInt();
    order.startingPrice = this.dequeueFloat() || Number.MAX_VALUE;
    order.stockRefPrice = this.dequeueFloat() || Number.MAX_VALUE;
    order.delta = this.dequeueFloat() || Number.MAX_VALUE;
    order.stockRangeLower = this.dequeueFloat() || Number.MAX_VALUE;
    order.stockRangeUpper = this.dequeueFloat() || Number.MAX_VALUE;
    order.displaySize = this.dequeueInt();

    if (version < 18) {
      // will never happen
      /* order.rthOnly = */ this.dequeueBool();
    }

    order.blockOrder = this.dequeueBool();
    order.sweepToFill = this.dequeueBool();
    order.allOrNone = this.dequeueBool();
    order.minQty = this.dequeueInt() || Number.MAX_VALUE;
    order.ocaType = this.dequeueInt();
    order.eTradeOnly = this.dequeueBool();
    order.firmQuoteOnly = this.dequeueBool();
    order.nbboPriceCap = this.dequeueFloat() || Number.MAX_VALUE;
  }

  if (version >= 10) {
    order.parentId = this.dequeueInt();
    order.triggerMethod = this.dequeueInt();
  }

  var receivedInt;

  if (version >= 11) {
    order.volatility = this.dequeueFloat() || Number.MAX_VALUE;
    order.volatilityType = this.dequeueInt();

    if (version === 11) {
      receivedInt = this.dequeueInt();
      order.deltaNeutralOrderType = (receivedInt === 0 ? 'NONE' : 'MKT');
    } else {  // version 12 and up
      order.deltaNeutralOrderType = this.dequeue();
      order.deltaNeutralAuxPrice = this.dequeueFloat() || Number.MAX_VALUE;

      if (version >= 27 && !_.isEmpty(order.deltaNeutralOrderType)) {
        order.deltaNeutralConId = this.dequeueInt();
        order.deltaNeutralSettlingFirm = this.dequeue();
        order.deltaNeutralClearingAccount = this.dequeue();
        order.deltaNeutralClearingIntent = this.dequeue();
      }

      if (version >= 31 && !_.isEmpty(order.deltaNeutralOrderType)) {
        order.deltaNeutralOpenClose = this.dequeue();
        order.deltaNeutralShortSale = this.dequeueBool();
        order.deltaNeutralShortSaleSlot = this.dequeueInt();
        order.deltaNeutralDesignatedLocation = this.dequeue();
      }
    }

    order.continuousUpdate = this.dequeueInt();

    if (this._controller._serverVersion === 26) {
      order.stockRangeLower = this.dequeueFloat();
      order.stockRangeUpper = this.dequeueFloat();
    }

    order.referencePriceType = this.dequeueInt();
  }

  if (version >= 13) {
    order.trailStopPrice = this.dequeueFloat() || Number.MAX_VALUE;
  }

  if (version >= 30) {
    order.trailingPercent = this.dequeueFloat() || Number.MAX_VALUE;
  }

  if (version >= 14) {
    order.basisPoints = this.dequeueFloat() || Number.MAX_VALUE;
    order.basisPointsType = this.dequeueInt() || Number.MAX_VALUE;
    contract.comboLegsDescrip = this.dequeue();
  }

  var comboLeg;
  var comboLegsCount;
  var orderComboLeg;
  var orderComboLegsCount;
  var price;

  if (version >= 29) {
    comboLegsCount = this.dequeueInt();

    if (comboLegsCount > 0) {
      contract.comboLegs = [];

      for (i = 0; i < comboLegsCount; ++i) {
        comboLeg = {};
        comboLeg.conId = this.dequeueInt();
        comboLeg.ratio = this.dequeueInt();
        comboLeg.action = this.dequeue();
        comboLeg.exchange = this.dequeue();
        comboLeg.openClose = this.dequeueInt();
        comboLeg.shortSaleSlot = this.dequeueInt();
        comboLeg.designatedLocation = this.dequeue();
        comboLeg.exemptCode = this.dequeueInt();
        contract.comboLegs.push(comboLeg);
      }
    }

    orderComboLegsCount = this.dequeueInt();

    if (orderComboLegsCount > 0) {
      order.orderComboLegs = [];

      for (i = 0; i < orderComboLegsCount; ++i) {
        orderComboLeg = {};
        order.price = this.dequeueFloat() || Number.MAX_VALUE;
        order.orderComboLegs.push(orderComboLeg);
      }
    }
  }

  var smartComboRoutingParamsCount;
  var tagValue;

  if (version >= 26) {
    smartComboRoutingParamsCount = this.dequeueInt();
    if (smartComboRoutingParamsCount > 0) {
      order.smartComboRoutingParams = [];

      for (i = 0; i < smartComboRoutingParamsCount; ++i) {
        tagValue = {};
        tagValue.tag = this.dequeue();
        tagValue.value = this.dequeue();
        order.smartComboRoutingParams.push(tagValue);
      }
    }
  }

  if (version >= 15) {
    if (version >= 20) {
      order.scaleInitLevelSize = this.dequeueInt() || Number.MAX_VALUE;
      order.scaleSubsLevelSize = this.dequeueInt() || Number.MAX_VALUE;
    } else {
      /* int notSuppScaleNumComponents = */ this.dequeueInt() || Number.MAX_VALUE;
      order.scaleInitLevelSize = this.dequeueInt() || Number.MAX_VALUE;
    }
    order.scalePriceIncrement = this.dequeueFloat() || Number.MAX_VALUE;
  }

  if (version >= 28 && order.scalePriceIncrement > 0.0 && order.scalePriceIncrement !== Number.MAX_VALUE) {
    order.scalePriceAdjustValue = this.dequeueFloat() || Number.MAX_VALUE;
    order.scalePriceAdjustInterval = this.dequeueInt() || Number.MAX_VALUE;
    order.scaleProfitOffset = this.dequeueFloat() || Number.MAX_VALUE;
    order.scaleAutoReset = this.dequeueBool();
    order.scaleInitPosition = this.dequeueInt() || Number.MAX_VALUE;
    order.scaleInitFillQty = this.dequeueInt() || Number.MAX_VALUE;
    order.scaleRandomPercent = this.dequeueBool();
  }

  if (version >= 24) {
    order.hedgeType = this.dequeue();

    if (!_.isEmpty(order.hedgeType)) {
      order.hedgeParam = this.dequeue();
    }
  }

  if (version >= 25) {
    order.optOutSmartRouting = this.dequeueBool();
  }

  if (version >= 19) {
    order.clearingAccount = this.dequeue();
    order.clearingIntent = this.dequeue();
  }

  if (version >= 22) {
    order.notHeld = this.dequeueBool();
  }

  var underComp;

  if (version >= 20) {
    if (this.dequeueBool()) {
      underComp = {};
      underComp.conId = this.dequeueInt();
      underComp.delta = this.dequeueFloat();
      underComp.price = this.dequeueFloat();
      contract.underComp = underComp;
    }
  }

  var algoParamsCount;

  if (version >= 21) {
    order.algoStrategy = this.dequeue();

    if (!_.isEmpty(order.algoStrategy)) {
      algoParamsCount = this.dequeueInt();

      if (algoParamsCount > 0) {
        order.algoParams = [];

        for (i = 0; i < algoParamsCount; ++i) {
          tagValue = {};
          tagValue.tag = this.dequeue();
          tagValue.value = this.dequeue();
          order.algoParams.push(tagValue);
        }
      }
    }
  }

  var orderState = {};

  if (version >= 16) {
    order.whatIf = this.dequeueBool();
    orderState.status = this.dequeue();
    orderState.initMargin = this.dequeue();
    orderState.maintMargin = this.dequeue();
    orderState.equityWithLoan = this.dequeue();
    orderState.commission = this.dequeueFloat() || Number.MAX_VALUE;
    orderState.minCommission = this.dequeueFloat() || Number.MAX_VALUE;
    orderState.maxCommission = this.dequeueFloat() || Number.MAX_VALUE;
    orderState.commissionCurrency = this.dequeue();
    orderState.warningText = this.dequeue();
  }

  this._emit('openOrder', order.orderId, contract, order, orderState);
};

Incoming.prototype._OPEN_ORDER_END = function () {
  var version = this.dequeueInt();

  this._emit('openOrderEnd');
};

Incoming.prototype._ORDER_STATUS = function () {
  var version = this.dequeueInt();
  var id = this.dequeueInt();
  var status = this.dequeue();
  var filled = this.dequeueInt();
  var remaining = this.dequeueInt();
  var avgFillPrice = this.dequeueFloat();

  var permId = 0;

  if (version >= 2) {
    permId = this.dequeueInt();
  }

  var parentId = 0;

  if (version >= 3) {
    parentId = this.dequeueInt();
  }

  var lastFillPrice = 0;

  if (version >= 4) {
    lastFillPrice = this.dequeueFloat();
  }

  var clientId = 0;

  if (version >= 5) {
    clientId = this.dequeueInt();
  }

  var whyHeld = null;

  if (version >= 6) {
    whyHeld = this.dequeue();
  }

  this._emit('orderStatus', id, status, filled, remaining, avgFillPrice,
                                       permId, parentId, lastFillPrice, clientId, whyHeld);
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

  var position = this.dequeueInt();
  var marketPrice = this.dequeueFloat();
  var marketValue = this.dequeueFloat();
  var averageCost = 0.0;
  var unrealizedPNL = 0.0;
  var realizedPNL = 0.0;

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

  this._emit('updatePortfolio', contract, position, marketPrice, marketValue,
                                           averageCost, unrealizedPNL, realizedPNL, accountName);
};

Incoming.prototype._POSITION = function () {
  var version = this.dequeueInt();
  var account = this.dequeue();
  var contract = {};

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

  var pos = this.dequeueInt();
  var avgCost = 0;
  if (version >= 3) {
    avgCost = this.dequeueFloat();
  }

  this._emit('position', account, contract, pos, avgCost);
};

Incoming.prototype._POSITION_END = function () {
  var version = this.dequeueInt();

  this._emit('positionEnd');
};

Incoming.prototype._REAL_TIME_BARS = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var time = this.dequeueInt();
  var open = this.dequeueFloat();
  var high = this.dequeueFloat();
  var low = this.dequeueFloat();
  var close = this.dequeueFloat();
  var volume = this.dequeueInt();
  var wap = this.dequeueFloat();
  var count = this.dequeueInt();

  this._emit('realtimeBar', reqId, time, open, high, low, close, volume, wap, count);
};

Incoming.prototype._RECEIVE_FA = function () {
  var version = this.dequeueInt();
  var faDataType = this.dequeueInt();
  var xml = this.dequeue();

  this._emit('receiveFA', faDataType, xml);
};

Incoming.prototype._SCANNER_DATA = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var numberOfElements = this.dequeueInt();

  var rank;

  while (numberOfElements--) {
    var contract = {
      summary: {}
    };
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

    var distance = this.dequeue();
    var benchmark = this.dequeue();
    var projection = this.dequeue();
    var legsStr = null;

    if (version >= 2) {
      legsStr = this.dequeue();
    }

    this._emit('scannerData', tickerId, rank, contract, distance,
                                         benchmark, projection, legsStr);
  }

  this._emit('scannerDataEnd', tickerId);
};

Incoming.prototype._SCANNER_PARAMETERS = function () {
  var version = this.dequeueInt();
  var xml = this.dequeue();

  this._emit('scannerParameters', xml);
};

Incoming.prototype._SECURITY_DEFINITION_OPTION_PARAMETER = function() {
  var reqId           = this.dequeueInt();
  var exchange        = this.dequeue();
  var underlyingConId = this.dequeueInt();
  var tradingClass    = this.dequeue();
  var multiplier      = this.dequeue();
  var expCount        = this.dequeueInt();
  var expirations     = [];
  
  for (var i = 0; i < expCount; i++) {
    expirations.push(this.dequeue());    
  }
  
  var strikeCount = this.dequeueInt();
  var strikes     = [];
  for (var i = 0; i < strikeCount; i++) {
    strikes.push(this.dequeueFloat());
  }
  
  this._emit('securityDefinitionOptionParameter', reqId, exchange, underlyingConId, tradingClass, multiplier, expirations, strikes);
    
};

Incoming.prototype._SECURITY_DEFINITION_OPTION_PARAMETER_END = function() {
  var reqId           = this.dequeueInt();
  this._emit('securityDefinitionOptionParameterEnd', reqId);  
};

Incoming.prototype._TICK_EFP = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var tickType = this.dequeueInt();
  var basisPoints = this.dequeueFloat();
  var formattedBasisPoints = this.dequeue();
  var impliedFuturesPrice = this.dequeueFloat();
  var holdDays = this.dequeueInt();
  var futureExpiry = this.dequeue();
  var dividendImpact = this.dequeueFloat();
  var dividendsToExpiry = this.dequeueFloat();

  this._emit('tickEFP', tickerId, tickType, basisPoints, formattedBasisPoints,
                                   impliedFuturesPrice, holdDays, futureExpiry,
                                   dividendImpact, dividendsToExpiry);
};

Incoming.prototype._TICK_GENERIC = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var tickType = this.dequeueInt();
  var value = this.dequeueFloat();

  this._emit('tickGeneric', tickerId, tickType, value);
};

Incoming.prototype._TICK_OPTION_COMPUTATION = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var tickType = this.dequeueInt();
  var impliedVol = this.dequeueFloat();

  if (impliedVol < 0) {  // -1 is the "not yet computed" indicator
    impliedVol = Number.MAX_VALUE;
  }

  var delta = this.dequeueFloat();

  if (Math.abs(delta) > 1) {  // -2 is the "not yet computed" indicator
    delta = Number.MAX_VALUE;
  }

  var optPrice = Number.MAX_VALUE;
  var pvDividend = Number.MAX_VALUE;
  var gamma = Number.MAX_VALUE;
  var vega = Number.MAX_VALUE;
  var theta = Number.MAX_VALUE;
  var undPrice = Number.MAX_VALUE;

  if (version >= 6 || tickType == C.TICK_TYPE.MODEL_OPTION) {  // introduced in version == 5
    optPrice = this.dequeueFloat();

    if (optPrice < 0) {  // -1 is the "not yet computed" indicator
      optPrice = Number.MAX_VALUE;
    }

    pvDividend = this.dequeueFloat();

    if (pvDividend < 0) {  // -1 is the "not yet computed" indicator
      pvDividend = Number.MAX_VALUE;
    }
  }

  if (version >= 6) {
    gamma = this.dequeueFloat();

    if (Math.abs(gamma) > 1) {  // -2 is the "not yet computed" indicator
      gamma = Number.MAX_VALUE;
    }

    vega = this.dequeueFloat();

    if (Math.abs(vega) > 1) {  // -2 is the "not yet computed" indicator
      vega = Number.MAX_VALUE;
    }

    theta = this.dequeueFloat();

    if (Math.abs(theta) > 1) {  // -2 is the "not yet computed" indicator
      theta = Number.MAX_VALUE;
    }

    undPrice = this.dequeueFloat();

    if (undPrice < 0) {  // -1 is the "not yet computed" indicator
      undPrice = Number.MAX_VALUE;
    }
  }

  this._emit('tickOptionComputation', tickerId, tickType, impliedVol, delta, optPrice, pvDividend, gamma, vega, theta, undPrice);
};

Incoming.prototype._TICK_PRICE = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var tickType = this.dequeueInt();
  var price = this.dequeueFloat();
  var size = 0;

  if (version >= 2) {
    size = this.dequeueInt();
  }

  var canAutoExecute = 0;

  if (version >= 3) {
    canAutoExecute = this.dequeueBool();
  }

  this._emit('tickPrice', tickerId, tickType, price, canAutoExecute);

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
      this._emit('tickSize', tickerId, sizeTickType, size);
    }
  }
};

Incoming.prototype._TICK_SIZE = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var tickType = this.dequeueInt();
  var size = this.dequeueInt();

  this._emit('tickSize', tickerId, tickType, size);
};

Incoming.prototype._TICK_SNAPSHOT_END = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();

  this._emit('tickSnapshotEnd', reqId);
};

Incoming.prototype._TICK_STRING = function () {
  var version = this.dequeueInt();
  var tickerId = this.dequeueInt();
  var tickType = this.dequeueInt();
  var value = this.dequeue();

  this._emit('tickString', tickerId, tickType, value);
};

Incoming.prototype._DISPLAY_GROUP_LIST = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var list = this.dequeue();
    
  this._emit("displayGroupList", reqId, list);
};

Incoming.prototype._DISPLAY_GROUP_UPDATED = function () {
  var version = this.dequeueInt();
  var reqId = this.dequeueInt();
  var contractInfo = this.dequeue();
    
  this._emit("displayGroupUpdated", reqId, contractInfo);
};

Incoming.prototype._emit = function () {
  this._emitQueue.push(arguments);
};

Incoming.prototype.dequeue = function () {
  if (this._dataQueue.length == 0) {
    throw new errors.UnderrunError();
  }
  var result = this._dataQueue.shift();
  return result;
};

Incoming.prototype.dequeueBool = function () {
  return !!parseInt(this.dequeue(), 10);
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
  var constKey;
  var token;
  var dataQueueSnapshot;

  while (true) {
    dataQueueSnapshot = this._dataQueue.slice();

    try {
      // Clear the Emit Queue; if this doesn't get cleared, it piles up whenever there's an error (added by heberallred)
      this._emitQueue = [];

      token = this.dequeueInt();
      constKey = this._controller._ib.util.incomingToString(token);

      if (constKey && _.has(this.constructor.prototype, '_' + constKey) && _.isFunction(this['_' + constKey])) {
        this['_' + constKey]();
      } else {
        this._controller.emitError('Unknown incoming first token: ' + token);
      }
    } catch (e) {
      if (!(e instanceof errors.UnderrunError)) {
        throw e;
      }
      // Put data back in the queue, and don't emit any events.
      this._dataQueue = this._dataQueue.concat(dataQueueSnapshot);
      return;
    }
    // Drain _emitQueue.
    var self = this;
    var toEmit = this._emitQueue;
    this._emitQueue = [];
    _.forEach(toEmit, function (payload) {
      self._controller.emit.apply(self._controller, payload);
    });
  }
};

module.exports = Incoming;
