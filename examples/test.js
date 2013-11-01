/*
 * examples/test.js
 */

'use strict';

var IB = require('..');

var ib = new IB({
  // host: '127.0.0.1',
  // port: 4923
});

ib.on('nextValidId', function (orderId) {
  console.log('nextValidId: %s', orderId);
});

ib.connect();
ib.reqCurrentTime();
ib.reqCurrentTime();
ib.reqCurrentTime();
ib.reqCurrentTime();
ib.reqCurrentTime();
// ib.reqOpenOrders();
// ib.disconnect();
