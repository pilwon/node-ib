/*
 * lib/outgoing.js
 */

'use strict';

var _ = require('lodash');

var C = require('./constants');

function _nullifyMax(number) {
  if (number === Number.MAX_VALUE) {
    return null;
  } else {
    return number;
  }
}

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
  var comboLeg,
      orderComboLeg;

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SCALE_ORDERS) {
    if (order.scaleInitLevelSize != Number.MAX_VALUE ||
        order.scalePriceIncrement != Number.MAX_VALUE) {
      return this._controller.emitError('It does not support Scale orders.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SSHORT_COMBO_LEGS) {
    if (_.isArray(contract.comboLegs)) {
      contract.comboLegs.forEach(function (comboLeg) {
        if (comboLeg.shortSaleSlot !== 0 || !_.isEmpty(comboLeg.designatedLocation)) {
          return this._controller.emitError('It does not support SSHORT flag for combo legs.');
        }
      });
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.WHAT_IF_ORDERS) {
    if (order.whatIf) {
      return this._controller.emitError('It does not support what-if orders.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.UNDER_COMP) {
    if (contract.underComp) {
      return this._controller.emitError('It does not support delta-neutral orders.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SCALE_ORDERS2) {
    if (order.scaleSubsLevelSize !== Number.MAX_VALUE) {
      return this._controller.emitError('It does not support Subsequent Level Size for Scale orders.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.ALGO_ORDERS) {
    if (!_.isEmpty(order.algoStrategy)) {
      return this._controller.emitError('It does not support algo orders.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.NOT_HELD) {
    if (order.notHeld) {
      return this._controller.emitError('It does not support notHeld parameter.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SEC_ID_TYPE) {
    if (!_.isEmpty(contract.secIdType) || !_.isEmpty(contract.secId)) {
      return this._controller.emitError('It does not support secIdType and secId parameters.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.PLACE_ORDER_CONID) {
    if (contract.conId > 0) {
      return this._controller.emitError('It does not support conId parameter.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SSHORTX) {
    if (order.exemptCode !== -1) {
      return this._controller.emitError('It does not support exemptCode parameter.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SSHORTX) {
    if (_.isArray(contract.comboLegs)) {
      contract.comboLegs.forEach(function (comboLeg) {
        if (comboLeg.exemptCode !== -1) {
          return this._controller.emitError('It does not support exemptCode parameter.');
        }
      });
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.HEDGE_ORDERS) {
    if (!_.isEmpty(order.hedgeType)) {
      return this._controller.emitError('It does not support hedge orders.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.OPT_OUT_SMART_ROUTING) {
    if (order.optOutSmartRouting) {
      return this._controller.emitError('It does not support optOutSmartRouting parameter.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.DELTA_NEUTRAL_CONID) {
    if (order.deltaNeutralConId > 0 ||
        !_.isEmpty(order.deltaNeutralSettlingFirm) ||
        !_.isEmpty(order.deltaNeutralClearingAccount) ||
        !_.isEmpty(order.deltaNeutralClearingIntent)) {
      return this._controller.emitError('It does not support deltaNeutral parameters: ConId, SettlingFirm, ClearingAccount, ClearingIntent.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.DELTA_NEUTRAL_OPEN_CLOSE) {
    if (!_.isEmpty(order.deltaNeutralOpenClose) ||
        order.deltaNeutralShortSale ||
        order.deltaNeutralShortSaleSlot > 0 ||
        !_.isEmpty(order.deltaNeutralDesignatedLocation)) {
      return this._controller.emitError('It does not support deltaNeutral parameters: OpenClose, ShortSale, ShortSaleSlot, DesignatedLocation.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SCALE_ORDERS3) {
    if (order.scalePriceIncrement > 0 && order.scalePriceIncrement != Number.MAX_VALUE) {
      if (order.scalePriceAdjustValue !== Number.MAX_VALUE ||
          order.scalePriceAdjustInterval !== Number.MAX_VALUE ||
          order.scaleProfitOffset !== Number.MAX_VALUE ||
          order.scaleAutoReset ||
          order.scaleInitPosition !== Number.MAX_VALUE ||
          order.scaleInitFillQty !== Number.MAX_VALUE ||
          order.scaleRandomPercent) {
        return this._controller.emitError('It does not support Scale order parameters: PriceAdjustValue, PriceAdjustInterval, ProfitOffset, AutoReset, InitPosition, InitFillQty and RandomPercent');
      }
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.ORDER_COMBO_LEGS_PRICE &&
      _.isString(contract.secType) &&
      C.BAG_SEC_TYPE.toUpperCase() === contract.secType.toUpperCase()) {
    if (_.isArray(order.orderComboLegs)) {
      order.orderComboLegs.forEach(function (orderComboLeg) {
        if (orderComboLeg.price !== Number.MAX_VALUE) {
          return this._controller.emitError('It does not support per-leg prices for order combo legs.');
        }
      });
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRAILING_PERCENT) {
    if (order.trailingPercent !== Number.MAX_VALUE) {
      return this._controller.emitError('It does not support trailing percent parameter.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRADING_CLASS) {
    if (!_.isEmpty(contract.tradingClass)) {
      return this._controller.emitError('It does not support tradingClass parameters in placeOrder.');
    }
  }

  if (this._controller._serverVersion < C.MIN_SERVER_VER.SCALE_TABLE) {
    if (!_.isEmpty(order.scaleTable) ||
        !_.isEmpty(order.activeStartTime) ||
        !_.isEmpty(order.activeStopTime)) {
      return this._controller.emitError('It does not support scaleTable, activeStartTime and activeStopTime parameters.');
    }
  }

  var version = (this._controller._serverVersion < C.MIN_SERVER_VER.NOT_HELD ? 27 : 41);

  // send place order msg
  var args = [C.OUTGOING.PLACE_ORDER, version, id];

  // send contract fields
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.PLACE_ORDER_CONID) {
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
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SEC_ID_TYPE){
    args.push(contract.secIdType);
    args.push(contract.secId);
  }

  // send main order fields
  args.push(order.action);
  args.push(order.totalQuantity);
  args.push(order.orderType);
  if (this._controller._serverVersion < C.MIN_SERVER_VER.ORDER_COMBO_LEGS_PRICE) {
    args.push(order.lmtPrice === Number.MAX_VALUE ? 0 : order.lmtPrice);
  } else {
    args.push(_nullifyMax(order.lmtPrice));
  }
  if (this._controller._serverVersion < C.MIN_SERVER_VER.TRAILING_PERCENT) {
    args.push(order.auxPrice === Number.MAX_VALUE ? 0 : order.auxPrice);
  } else {
    args.push(_nullifyMax(order.auxPrice));
  }

  // send extended order fields
  args.push(order.tif);
  args.push(order.ocaGroup);
  args.push(order.account);
  args.push(order.openClose);
  args.push(order.origin);
  args.push(order.orderRef);
  args.push(order.transmit);
  if (this._controller._serverVersion >= 4) {
    args.push(order.parentId);
  }

  if (this._controller._serverVersion >= 5) {
    args.push(order.blockOrder);
    args.push(order.sweepToFill);
    args.push(order.displaySize);
    args.push(order.triggerMethod);
    if (this._controller._serverVersion < 38) {
      // will never happen
      args.push(/* order.ignoreRth */ false);
    } else {
      args.push(order.outsideRth);
    }
  }

  if (this._controller._serverVersion >= 7) {
    args.push(order.hidden);
  }

  // Send combo legs for BAG requests
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
        args.push(comboLeg.openClose);

        if (this._controller._serverVersion >= C.MIN_SERVER_VER.SSHORT_COMBO_LEGS) {
          args.push(comboLeg.shortSaleSlot);
          args.push(comboLeg.designatedLocation);
        }
        if (this._controller._serverVersion >= C.MIN_SERVER_VER.SSHORTX_OLD) {
          args.push(comboLeg.exemptCode);
        }
      });
    }
  }

  // Send order combo legs for BAG requests
  if (this._controller._serverVersion >= C.MIN_SERVER_VER.ORDER_COMBO_LEGS_PRICE &&
      _.isString(contract.secType) &&
      C.BAG_SEC_TYPE.toUpperCase() === contract.secType.toUpperCase()) {
    if (!_.isArray(order.orderComboLegs)) {
      args.push(0);
    } else {
      args.push(order.orderComboLegs.length);
      order.orderComboLegs.forEach(function (orderComboLeg) {
        args.push(_nullifyMax(orderComboLeg.price));
      });
    }
  }

  var smartComboRoutingParamsCount;

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SMART_COMBO_ROUTING_PARAMS &&
      _.isString(contract.secType) &&
      C.BAG_SEC_TYPE.toUpperCase() === contract.secType.toUpperCase()) {
    smartComboRoutingParamsCount = !_.isArray(order.smartComboRoutingParams) ? 0 : order.smartComboRoutingParams.length;
    args.push(smartComboRoutingParamsCount);

    if (smartComboRoutingParamsCount > 0) {
      order.smartComboRoutingParams.forEach(function (tagValue) {
        args.push(tagValue.tag);
        args.push(tagValue.value);
      });
    }
  }

  if (this._controller._serverVersion >= 9) {
    // send deprecated sharesAllocation field
    args.push('');
  }

  if (this._controller._serverVersion >= 10) {
    args.push(order.discretionaryAmt);
  }

  if (this._controller._serverVersion >= 11) {
    args.push(order.goodAfterTime);
  }

  if (this._controller._serverVersion >= 12) {
    args.push(order.goodTillDate);
  }

  if (this._controller._serverVersion >= 13) {
    args.push(order.faGroup);
    args.push(order.faMethod);
    args.push(order.faPercentage);
    args.push(order.faProfile);
  }

  if (this._controller._serverVersion >= 18) {  // institutional short sale slot fields.
    args.push(order.shortSaleSlot);       // 0 only for retail, 1 or 2 only for institution.
    args.push(order.designatedLocation);  // only populate when order.shortSaleSlot = 2.
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SSHORTX_OLD) {
    args.push(order.exemptCode);
  }

  var lower,
      upper;

  if (this._controller._serverVersion >= 19) {
    args.push(order.ocaType);

    if (this._controller._serverVersion < 38) {
      // will never happen
      args.push(/* order.rthOnly */ false);
    }

    args.push(order.rule80A);
    args.push(order.settlingFirm);
    args.push(order.allOrNone);
    args.push(_nullifyMax(order.minQty));
    args.push(_nullifyMax(order.percentOffset));
    args.push(order.eTradeOnly);
    args.push(order.firmQuoteOnly);
    args.push(_nullifyMax(order.nbboPriceCap));
    args.push(_nullifyMax(order.auctionStrategy));
    args.push(_nullifyMax(order.startingPrice));
    args.push(_nullifyMax(order.stockRefPrice));
    args.push(_nullifyMax(order.delta));

    // Volatility orders had specific watermark price attribs in server version 26
    lower = ((this._controller._serverVersion == 26 && order.orderType === 'VOL') ?
        Number.MAX_VALUE :
        order.stockRangeLower);
    upper = (this._controller._serverVersion == 26 && order.orderType === 'VOL') ?
      Number.MAX_VALUE :
      order.stockRangeUpper;
    args.push(_nullifyMax(lower));
    args.push(_nullifyMax(upper));
  }

  if (this._controller._serverVersion >= 22) {
    args.push(order.overridePercentageConstraints);
  }

  if (this._controller._serverVersion >= 26) { // Volatility orders
     args.push(_nullifyMax(order.volatility));
     args.push(_nullifyMax(order.volatilityType));

    if (this._controller._serverVersion < 28) {
      args.push(order.deltaNeutralOrderType.toUpperCase() === 'MKT');
    } else {
      args.push(order.deltaNeutralOrderType);
      args.push(_nullifyMax(order.deltaNeutralAuxPrice));

      if (this._controller._serverVersion >= C.MIN_SERVER_VER.DELTA_NEUTRAL_CONID &&
          !_.isEmpty(order.deltaNeutralOrderType)){
        args.push(order.deltaNeutralConId);
        args.push(order.deltaNeutralSettlingFirm);
        args.push(order.deltaNeutralClearingAccount);
        args.push(order.deltaNeutralClearingIntent);
      }

      if (this._controller._serverVersion >= C.MIN_SERVER_VER.DELTA_NEUTRAL_OPEN_CLOSE &&
          !_.isEmpty(order.deltaNeutralOrderType)){
        args.push(order.deltaNeutralOpenClose);
        args.push(order.deltaNeutralShortSale);
        args.push(order.deltaNeutralShortSaleSlot);
        args.push(order.deltaNeutralDesignatedLocation);
      }
    }

    args.push(order.continuousUpdate);

    if (this._controller._serverVersion == 26) {
      // Volatility orders had specific watermark price attribs in server version 26
      lower = (order.orderType === 'VOL' ? order.stockRangeLower : Number.MAX_VALUE);
      upper = (order.orderType === 'VOL' ? order.stockRangeUpper : Number.MAX_VALUE);
      args.push(_nullifyMax(lower));
      args.push(_nullifyMax(upper));
    }

    args.push(_nullifyMax(order.referencePriceType));
  }

  if (this._controller._serverVersion >= 30) { // TRAIL_STOP_LIMIT stop price
    args.push(_nullifyMax(order.trailStopPrice));
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.TRAILING_PERCENT){
    args.push(_nullifyMax(order.trailingPercent));
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SCALE_ORDERS) {
    if (this._controller._serverVersion >= C.MIN_SERVER_VER.SCALE_ORDERS2) {
     args.push(_nullifyMax(order.scaleInitLevelSize));
     args.push(_nullifyMax(order.scaleSubsLevelSize));
    } else {
      args.push('');
      args.push(_nullifyMax(order.scaleInitLevelSize));
    }
    args.push(_nullifyMax(order.scalePriceIncrement));
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SCALE_ORDERS3 &&
      order.scalePriceIncrement > 0.0 &&
      order.scalePriceIncrement != Number.MAX_VALUE) {
    args.push(_nullifyMax(order.scalePriceAdjustValue));
    args.push(_nullifyMax(order.scalePriceAdjustInterval));
    args.push(_nullifyMax(order.scaleProfitOffset));
    args.push(order.scaleAutoReset);
    args.push(_nullifyMax(order.scaleInitPosition));
    args.push(_nullifyMax(order.scaleInitFillQty));
    args.push(order.scaleRandomPercent);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.SCALE_TABLE) {
    args.push(order.scaleTable);
    args.push(order.activeStartTime);
    args.push(order.activeStopTime);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.HEDGE_ORDERS) {
    args.push(order.hedgeType);
    if (!_.isEmpty(order.hedgeType)) {
      args.push(order.hedgeParam);
    }
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.OPT_OUT_SMART_ROUTING) {
    args.push(order.optOutSmartRouting);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.PTA_ORDERS) {
    args.push(order.clearingAccount);
    args.push(order.clearingIntent);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.NOT_HELD) {
    args.push(order.notHeld);
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.UNDER_COMP) {
    if (_.isPlainObject(contract.underComp) && !_.isEmpty(contract.underComp)) {
      args.push(true);
      args.push(contract.underComp.conId);
      args.push(contract.underComp.delta);
      args.push(contract.underComp.price);
    } else {
      args.push(false);
    }
  }

  var algoParamsCount;

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.ALGO_ORDERS) {
    args.push(order.algoStrategy);
    if (!_.isEmpty(order.algoStrategy)) {
      algoParamsCount = (!_.isArray(order.algoParams) ? 0 : order.algoParams.length);
      args.push(algoParamsCount);
      if (algoParamsCount > 0) {
        order.algoParams.forEach(function (tagValue) {
          args.push(tagValue.tag);
          args.push(tagValue.value);
        });
      }
    }
  }

  if (this._controller._serverVersion >= C.MIN_SERVER_VER.WHAT_IF_ORDERS) {
    args.push(order.whatIf);
  }

  this._send(args);
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

  args.push(_nullifyMax(subscription.numberOfRows));
  args.push(subscription.instrument);
  args.push(subscription.locationCode);
  args.push(subscription.scanCode);
  args.push(_nullifyMax(subscription.abovePrice));
  args.push(_nullifyMax(subscription.belowPrice));
  args.push(_nullifyMax(subscription.aboveVolume));
  args.push(_nullifyMax(subscription.marketCapAbove));
  args.push(_nullifyMax(subscription.marketCapBelow));
  args.push(subscription.moodyRatingAbove);
  args.push(subscription.moodyRatingBelow);
  args.push(subscription.spRatingAbove);
  args.push(subscription.spRatingBelow);
  args.push(subscription.maturityDateAbove);
  args.push(subscription.maturityDateBelow);
  args.push(_nullifyMax(subscription.couponRateAbove));
  args.push(_nullifyMax(subscription.couponRateBelow));
  args.push(subscription.excludeConvertible);

  if (this._controller._serverVersion >= 25) {
    args.push(_nullifyMax(subscription.averageOptionVolumeAbove));
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
