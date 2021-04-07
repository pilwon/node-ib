[![Logo](https://raw.github.com/pilwon/node-ib/master/logo.jpg)](http://interactivebrokers.com/)

[![NPM](https://nodei.co/npm/ib.png?downloads=false&stars=false)](https://npmjs.org/package/ib) [![NPM](https://nodei.co/npm-dl/ib.png?months=6)](https://npmjs.org/package/ib)

`ib` is an [Interactive Brokers](http://interactivebrokers.com/) TWS (or IB Gateway) API client library for [Node.js](http://nodejs.org/). Refer to the official [Trader Workstation API](https://interactivebrokers.github.io/tws-api/) documentation for details.

This is a direct port of Interactive Brokers' official Java client. There is no C++/Java library dependency. It makes a socket connection to TWS (or IB Gateway) using the [net](http://nodejs.org/api/net.html) module, and all messages are entirely processed in JavaScript. It uses [EventEmitter](http://nodejs.org/api/events.html) to pass the result back to user.

## _MAINTAINERS NEEDED_

The libary is lagging behind the official Java reference and [no updates have been made after v9.70 (~2017)](https://github.com/pilwon/node-ib/issues/145#issuecomment-526855798). This means that some newer features aren't implemented:
* [reqHistoricalNews and reqNewsArticle](https://github.com/pilwon/node-ib/issues/130)
* [time and sales data](https://github.com/pilwon/node-ib/issues/111)
* [trailing stop limit orders](https://github.com/pilwon/node-ib/issues/145)

## Installation

    $ npm install ib


## Usage

```js
var ib = new (require('ib'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error('error --- %s', err.message);
}).on('result', function (event, args) {
  console.log('%s --- %s', event, JSON.stringify(args));
}).once('nextValidId', function (orderId) {
  ib.placeOrder(
    orderId,
    ib.contract.stock('AAPL'),
    ib.order.limit('BUY', 1, 0.01)  // safe, unreal value used for demo
  );
  ib.reqOpenOrders();
}).once('openOrderEnd', function () {
  ib.disconnect();
})

ib.connect()
  .reqIds(1);
```

* [See more comprehensive examples here.](https://github.com/pilwon/node-ib/tree/master/examples)


## API

### Connection

```js
.connect()
.disconnect()
```

### Methods

```js
.calculateImpliedVolatility(reqId, contract, optionPrice, underPrice)
.calculateOptionPrice(reqId, contract, volatility, underPrice)
.cancelAccountSummary(reqId)
.cancelAccountUpdatesMulti(requestId)
.cancelCalculateImpliedVolatility(reqId)
.cancelCalculateOptionPrice(reqId)
.cancelFundamentalData(reqId)
.cancelHistoricalData(tickerId)
.cancelMktData(tickerId)
.cancelMktDepth(tickerId)
.cancelNewsBulletins()
.cancelOrder(id)
.cancelPositions()
.cancelPositionsMulti(requestId)
.cancelRealTimeBars(tickerId)
.cancelScannerSubscription(tickerId)
.cancelTickByTickData(tickerId)
.exerciseOptions(tickerId, contract, exerciseAction, exerciseQuantity, account, override)
.placeOrder(id, contract, order)
.replaceFA(faDataType, xml)
.reqAccountSummary(reqId, group, tags)
.reqAccountUpdates(subscribe, acctCode)
.reqAccountUpdatesMulti(requestId, account, modelCode, ledgerAndNLV)
.reqAllOpenOrders()
.reqAutoOpenOrders(bAutoBind)
.reqContractDetails(reqId, contract)
.reqCurrentTime()
.reqExecutions(reqId, filter)
.reqFundamentalData(reqId, contract, reportType)
.reqGlobalCancel()
.reqHistoricalData(tickerId, contract, endDateTime, durationStr, barSizeSetting, whatToShow, useRTH, formatDate, keepUpToDate)
.reqHistoricalTicks(tickerId, contract, startDateTime, endDateTime, numberOfTicks, whatToShow, useRTH, ignoreSize)
.reqTickByTickData(tickerId, contract, tickType, numberOfTicks, ignoreSize)
.reqIds(numIds)
.reqManagedAccts()
.reqMarketDataType(marketDataType)
.reqMatchingSymbols(tickerId, pattern)
.reqMktData(tickerId, contract, genericTickList, snapshot, regulatorySnapshot)
.reqMktDepth(tickerId, contract, numRows)
.reqNewsBulletins(allMsgs)
.reqOpenOrders()
.reqPositions()
.reqPositionsMulti(requestId, account, modelCode)
.reqRealTimeBars(tickerId, contract, barSize, whatToShow, useRTH)
.reqScannerParameters()
.reqScannerSubscription(tickerId, subscription)
.requestFA(faDataType)
.queryDisplayGroups(reqId)
.subscribeToGroupEvents(reqId, group)
.unsubscribeToGroupEvents(reqId)
.updateDisplayGroup(reqId, contract)
.setServerLogLevel(logLevel)
```

Note that .reqContractDetails doesn't respect the official format of the [ContractDetails class](https://interactivebrokers.github.io/tws-api/classIBApi_1_1ContractDetails.html). For example, the `Contract` field is replaced with a [`summary` field](https://github.com/pilwon/node-ib/blob/c37f234bfd1538323af1a6fe6c60c311d2767f7c/lib/incoming.js#L101) that contains some of the attributes in the contract.

### Events

```js
// General
.on('error', function (err, data))
.on('result', function (event, args))  // exclude connection
.on('all', function (event, args))  // error + connection + result

// Connection
.on('connected', function ())
.on('disconnected', function ())
.on('received', function (tokens, data))
.on('sent', function (tokens, data))
.on('server', function (version, connectionTime))

// Result
.on('accountDownloadEnd', function (accountName))
.on('accountUpdateMulti', function (reqId, account, modelCode, key, value, currency))
.on('accountUpdateMultiEnd', function (reqId))
.on('accountSummary', function (reqId, account, tag, value, currency))
.on('accountSummaryEnd', function (reqId))
.on('bondContractDetails', function (reqId, contract))
.on('commissionReport', function (commissionReport))
.on('contractDetails', function (reqId, contract))
.on('contractDetailsEnd', function (reqId))
.on('currentTime', function (time))
.on('deltaNeutralValidation', function (reqId, underComp))
.on('execDetails', function (reqId, contract, exec))
.on('execDetailsEnd', function (reqId))
.on('fundamentalData', function (reqId, data))
.on('historicalData', function (reqId, date, open, high, low, close, volume, count, WAP, hasGaps))
.on('historicalTickTradeData', (reqId, timestamp, mask, price, size, exchange, specialConditions))
.on('historicalTickBidAskData', (reqId, timestamp, mask, priceBid, priceAsk, sizeBid, sizeAsk))
.on('historicalTickMidPointData', (reqId, timestamp, price, size))
.on('tickByTickAllLast', reqId, tickType, time, price, size, { pastLimit, unreported }, exchange, specialConditions)
.on('tickByTickBidAsk', reqId, time, bidPrice, askPrice, bidSize, askSize, { bidPastLow, askPastHigh })
.on('tickByTickMidPoint', reqId, time, midPoint))
.on('managedAccounts', function (accountsList))
.on('marketDataType', function (reqId, marketDataType))
.on('nextValidId', function (orderId))
.on('openOrder', function (orderId, contract, order, orderState))
.on('openOrderEnd', function ())
.on('orderStatus', function (id, status, filled, remaining, avgFillPrice, permId, parentId, lastFillPrice, clientId, whyHeld))
.on('position', function (account, contract, pos, avgCost))
.on('positionEnd', function ())
.on('positionMulti', function (reqId, account, modelCode, contract, pos, avgCost))
.on('positionMultiEnd', function (reqId))
.on('realtimeBar', function (reqId, time, open, high, low, close, volume, wap, count))
.on('receiveFA', function (faDataType, xml))
.on('scannerData', function (tickerId, rank, contract, distance, benchmark, projection, legsStr))
.on('scannerDataEnd', function (tickerId))
.on('scannerParameters', function (xml))
.on('symbolSamples', function (contractDescriptions))
.on('tickEFP', function (tickerId, tickType, basisPoints, formattedBasisPoints, impliedFuturesPrice, holdDays, futureExpiry, dividendImpact, dividendsToExpiry))
.on('tickGeneric', function (tickerId, tickType, value))
.on('tickOptionComputation', function (tickerId, tickType, impliedVol, delta, optPrice, pvDividend, gamma, vega, theta, undPrice))
.on('tickPrice', function (tickerId, tickType, price, canAutoExecute))
.on('tickSize', function (tickerId, sizeTickType, size))
.on('tickSnapshotEnd', function (reqId))
.on('tickString', function (tickerId, tickType, value))
.on('updateAccountTime', function (timeStamp))
.on('updateAccountValue', function (key, value, currency, accountName))
.on('updateMktDepth', function (id, position, operation, side, price, size))
.on('updateMktDepthL2', function (id, position, marketMaker, operation, side, price, size))
.on('updateNewsBulletin', function (newsMsgId, newsMsgType, newsMessage, originatingExch))
.on('updatePortfolio', function (contract, position, marketPrice, marketValue, averageCost, unrealizedPNL, realizedPNL, accountName))
.on('displayGroupList', function(id, list))
.on('displayGroupUpdated', function(id, contract))
```

* [See Java client code for argument types (Boolean/Number/String)](https://github.com/pilwon/node-ib/blob/master/ref/client/EWrapper.java)

### Builders

```js
// Contract
.contract.combo(symbol, currency, exchange)
.contract.forex(symbol, currency)
.contract.future(symbol, expiry, currency, exchange)
.contract.option(symbol, expiry, strike, right, exchange, currency)
.contract.stock(symbol, exchange, currency)

// Order
.order.limit(action, quantity, price, transmitOrder)
.order.market(action, quantity, transmitOrder, goodAfterTime, goodTillDate)
.order.marketClose(action, quantity, price, transmitOrder)
.order.stop(action, quantity, price, transmitOrder, parentId, tif)
.order.stopLimit(action, quantity, limitPrice, stopPrice, transmitOrder, parentId, tif)
.order.trailingStop(action, quantity, auxPrice, tif, transmitOrder, parentId)
```

### Util

```js
.incomingToString(incoming)
.numberToString(number)
.outgoingToString(outgoing)
.tickTypeToString(tickType)
```


## Credits

  See the [contributors](https://github.com/pilwon/node-ib/graphs/contributors).


## License

<pre>
The MIT License (MIT)

Copyright (c) 2013-2021 Pilwon Huh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
</pre>

[![Analytics](https://ga-beacon.appspot.com/UA-47034562-7/node-ib/readme?pixel)](https://github.com/pilwon/node-ib)
