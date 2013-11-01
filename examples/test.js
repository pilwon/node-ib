/*
 * examples/test.js
 */

'use strict';

var util = require('util');

var ib = new (require('..'))({
  // host: '127.0.0.1',
  // port: 4923
});

var C = require('../lib/constants');

ib.on('error', function (err, data) {
  // console.log(util.format('%s --- %s', err.message, JSON.stringify(data)).red);
});

// ib.on('nextValidId', function (orderId) {
//   console.log('nextValidId: %s', orderId);
// });

ib.connect();

// ib.calculateImpliedVolatility(reqId, contract, optionPrice, underPrice);

// ib.calculateOptionPrice(reqId, contract, volatility, underPrice);

ib.cancelAccountSummary(12345);  // reqId

ib.cancelCalculateImpliedVolatility(12345);  // reqId

ib.cancelCalculateOptionPrice(12345);  // reqId

ib.cancelFundamentalData(12345);  // reqId

ib.cancelHistoricalData(12345);  // tickerId

ib.cancelMktData(12345);  // tickerId

ib.cancelMktDepth(12345);  // tickerId

ib.cancelNewsBulletins();

ib.cancelOrder(12345);  // id

ib.cancelPositions();

ib.cancelRealTimeBars(12345);  // tickerId

ib.cancelScannerSubscription(12345);  // tickerId

// ib.exerciseOptions(tickerId, contract, exerciseAction, exerciseQuantity, account, override);

// ib.placeOrder(id, contract, order);

// ib.replaceFA(faDataType, xml);

ib.reqAccountSummary(12345, 'All', 'AccountType,NetLiquidation,TotalCashValue,SettledCash,AccruedCash,BuyingPower,EquityWithLoanValue,PreviousEquityWithLoanValue,GrossPositionValue,RegTEquity,RegTMargin,SMA,InitMarginReq,MaintMarginReq,AvailableFunds,ExcessLiquidity,Cushion,FullInitMarginReq,FullMaintMarginReq,FullAvailableFunds,FullExcessLiquidity,LookAheadNextChange,LookAheadInitMarginReq,LookAheadMaintMarginReq,LookAheadAvailableFunds,LookAheadExcessLiquidity,HighestSeverity,DayTradesRemaining,Leverage');  // reqId, group, tags

ib.reqAccountUpdates(true, 'U1234567');  // subscribe, acctCode

ib.reqAllOpenOrders();

// ib.reqAutoOpenOrders(bAutoBind);

ib.reqContractDetails(101, {
  currency: 'USD',
  exchange: 'IDEALPRO',
  secType: 'CASH',
  symbol: 'EUR'
});  // reqId, contract

ib.reqCurrentTime();

// ib.reqExecutions(reqId, filter);

ib.reqFundamentalData(201, {
  currency: 'USD',
  exchange: 'SMART',
  primaryExch: 'NASDAQ',
  secType: 'STK',
  symbol: 'AMZN'
}, 'Estimates');  // reqId, contract, reportType

ib.reqFundamentalData(202, {
  currency: 'USD',
  exchange: 'SMART',
  primaryExch: 'NASDAQ',
  secType: 'STK',
  symbol: 'AMZN'
}, 'Financial Statements');  // reqId, contract, reportType

ib.reqFundamentalData(203, {
  currency: 'USD',
  exchange: 'SMART',
  primaryExch: 'NASDAQ',
  secType: 'STK',
  symbol: 'AMZN'
}, 'Summary');  // reqId, contract, reportType

ib.reqGlobalCancel();

// ib.reqHistoricalData(tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate);

ib.reqIds(5);  // numIds

ib.reqManagedAccts();

ib.reqMarketDataType(1);  // marketDataType (1 or 2)

// From this ordered list, from left to right, whichever currency comes first should be placed first
// EUR GBP AUD USD CAD CHF MXN HKD JPY INR NOK SEK

ib.reqMktData(301, {
  currency: 'USD',
  exchange: 'IDEALPRO',
  secType: 'CASH',
  symbol: 'EUR'
}, '', false);  // tickerId, contract, genericTickList, snapshot

ib.reqMktData(302, {
  currency: 'CAD',
  exchange: 'IDEALPRO',
  secType: 'CASH',
  symbol: 'USD'
}, '', false);  // tickerId, contract, genericTickList, snapshot

ib.reqMktData(303, {
  currency: 'USD',
  exchange: 'SMART',
  primaryExch: 'NASDAQ',
  secType: 'STK',
  symbol: 'AMZN'
}, '', false);  // tickerId, contract, genericTickList, snapshot

// ib.reqMktDepth(tickerId, contract, numRows);

ib.reqNewsBulletins(true);  // allMsgs

ib.reqOpenOrders();

ib.reqPositions();

// ib.reqRealTimeBars(tickerId, contract, barSize, whatToShow, useRTH);

// ib.reqScannerParameters();

ib.reqScannerSubscription(12345, {
  instrument: 'STK',
  locationCode: 'STK.NASDAQ.NMS',
  numberOfRows: 10,
  scanCode: 'TOP_PERC_GAIN',
  stockTypeFilter: 'ALL'
});  // tickerId, subscription

ib.requestFA(C.FA.GROUPS);  // faDataType

ib.requestFA(C.FA.PROFILES);  // faDataType

// ib.requestFA(C.FA.ALIASES);  // faDataType

ib.setServerLogLevel(C.LOG_LEVEL.WARN);  // logLevel

// ib.disconnect();
