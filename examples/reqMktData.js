/*
 * examples/reqMktData.js
 */

'use strict';

var util = require('util');

require('colors');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(util.format('ERROR: %s', err.message).red);
}).on('tickPrice', function (tickerId, tickType, price, canAutoExecute) {
  console.log(
    '%s tickerId=%s, price=%s, canAutoExecute=%s',
    util.format('[%s]', ib.util.tickTypeToString(tickType)).cyan,
    tickerId,
    price,
    !!canAutoExecute
  );
}).on('tickSize', function (tickerId, sizeTickType, size) {
  console.log(
    '%s tickerId=%s, size=%s',
    util.format('[%s]', ib.util.tickTypeToString(sizeTickType)).cyan,
    tickerId,
    size
  );
});

ib.connect();

ib.reqMktData(1, {
  currency: 'USD',
  exchange: 'IDEALPRO',
  secType: 'CASH',
  symbol: 'EUR'
}, '', false);
