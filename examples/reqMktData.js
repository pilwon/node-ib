/*
 * examples/reqMktData.js
 */

'use strict';

var util = require('util');

require('colors');

var _ = require('lodash');

var CONTRACTS = {};

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(util.format('ERROR: %s', err.message).red);
}).on('result', function (event, args) {
  if (!_.contains(['tickGeneric', 'tickPrice', 'tickSize', 'tickString'], event)) {
    console.log('%s %s', (event + ':').yellow, JSON.stringify(args));
  }
}).on('tickGeneric', function (tickerId, tickType, value) {
  console.log(
    '%s %s%d %s%d',
    util.format('[%s]', ib.util.tickTypeToString(tickType)).cyan,
    'tickerId='.bold, tickerId,
    'value='.bold, value
  );
}).on('tickPrice', function (tickerId, tickType, price, canAutoExecute) {
  console.log(
    '%s %s%d %s%d %s%s',
    util.format('[%s]', ib.util.tickTypeToString(tickType)).cyan,
    'tickerId='.bold, tickerId,
    'price='.bold, price,
    'canAutoExecute='.bold, canAutoExecute
  );
}).on('tickSize', function (tickerId, sizeTickType, size) {
  console.log(
    '%s %s%d %s%d',
    util.format('[%s]', ib.util.tickTypeToString(sizeTickType)).cyan,
    'tickerId:'.bold, tickerId,
    'size:'.bold, size
  );
}).on('tickString', function (tickerId, tickType, value) {
  console.log(
    '%s %s%d %s%s',
    util.format('[%s]', ib.util.tickTypeToString(tickType)).cyan,
    'tickerId='.bold, tickerId,
    'value='.bold, value
  );
});

// TODO(?)
//   - tickOptionComputation
//   - tickEFP

ib.connect();

// Forex
ib.reqMktData(1, ib.contract.forex('EUR'), '', false);
ib.reqMktData(2, ib.contract.forex('GBP'), '', false);
ib.reqMktData(3, ib.contract.forex('CAD'), '', false);
ib.reqMktData(4, ib.contract.forex('HKD'), '', false);
ib.reqMktData(5, ib.contract.forex('JPY'), '', false);
ib.reqMktData(6, ib.contract.forex('KRW'), '', false);

// Stock
ib.reqMktData(11, ib.contract.stock('AAPL'), '', false);
ib.reqMktData(12, ib.contract.stock('AMZN'), '', false);
ib.reqMktData(13, ib.contract.stock('GOOG'), '', false);
ib.reqMktData(14, ib.contract.stock('FB'), '', false);

// Option
ib.reqMktData(21, ib.contract.option('AAPL', '201407', 500, 'C'), '', false);
ib.reqMktData(22, ib.contract.option('AMZN', '201404', 350, 'P'), '', false);
ib.reqMktData(23, ib.contract.option('GOOG', '201406', 1000, 'C'), '', false);
ib.reqMktData(24, ib.contract.option('FB', '201406', 50, 'P'), '', false);

// Unsubscribe after 15 seconds.
setTimeout(function () {
  console.log('Cancelling market data subscription...'.yellow);

  // Forex
  ib.cancelMktData(1);
  ib.cancelMktData(2);
  ib.cancelMktData(3);
  ib.cancelMktData(4);
  ib.cancelMktData(5);
  ib.cancelMktData(6);

  //Stock
  ib.cancelMktData(11);
  ib.cancelMktData(12);
  ib.cancelMktData(13);
  ib.cancelMktData(14);

  // Option
  ib.cancelMktData(21);
  ib.cancelMktData(22);
  ib.cancelMktData(23);
  ib.cancelMktData(24);
}, 15000);
