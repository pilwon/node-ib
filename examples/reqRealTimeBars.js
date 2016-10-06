var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['realtimeBar'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('realtimeBar', function (reqId, time, open, high, low, close, volume, wap, count) {
  console.log(
    '%s %s%d %s%d %s%d %s%d %s%d %s%d %s%d %s%d %s%d',
    chalk.cyan('[realtimeBar]'),
    'reqId='.bold, reqId,
    'time='.bold, time,
    'open='.bold, open,
    'high='.bold, high,
    'low='.bold, low,
    'close='.bold, close,
    'volume='.bold, volume,
    'wap='.bold, wap,
    'count='.bold, count
  );
});

ib.connect();

// Forex
// ib.reqRealTimeBars(1, ib.contract.forex('EUR'), 5, 'TRADES', false);
// ib.reqRealTimeBars(2, ib.contract.forex('GBP'), 5, 'BID', false);
// ib.reqRealTimeBars(3, ib.contract.forex('CAD'), 5, 'ASK', false);
// ib.reqRealTimeBars(4, ib.contract.forex('HKD'), 5, 'MIDPOINT', false);
// ib.reqRealTimeBars(5, ib.contract.forex('JPY'), 5, 'TRADES', false);
// ib.reqRealTimeBars(6, ib.contract.forex('KRW'), 5, 'BID', false);

// Stock
ib.reqRealTimeBars(11, ib.contract.stock('AAPL'), 5, 'TRADES', false);
ib.reqRealTimeBars(12, ib.contract.stock('AMZN'), 5, 'BID', false);
ib.reqRealTimeBars(13, ib.contract.stock('GOOG'), 5, 'ASK', false);
ib.reqRealTimeBars(14, ib.contract.stock('FB'), 5, 'MIDPOINT', false);

// Option
ib.reqRealTimeBars(21, ib.contract.option('AAPL', '201407', 500, 'C'), 5, 'TRADES', false);
ib.reqRealTimeBars(22, ib.contract.option('AMZN', '201404', 350, 'P'), 5, 'BID', false);
ib.reqRealTimeBars(23, ib.contract.option('GOOG', '201406', 1000, 'C'), 5, 'ASK', false);
ib.reqRealTimeBars(24, ib.contract.option('FB', '201406', 50, 'P'), 5, 'MIDPOINT', false);

// Disconnect after 10 seconds.
setTimeout(function () {
  console.log(chalk.yellow('Cancelling real-time bars subscription...'));

  // Forex
  // ib.cancelRealTimeBars(1);
  // ib.cancelRealTimeBars(2);
  // ib.cancelRealTimeBars(3);
  // ib.cancelRealTimeBars(4);
  // ib.cancelRealTimeBars(5);
  // ib.cancelRealTimeBars(6);

  //Stock
  ib.cancelRealTimeBars(11);
  ib.cancelRealTimeBars(12);
  ib.cancelRealTimeBars(13);
  ib.cancelRealTimeBars(14);

  // Option
  ib.cancelRealTimeBars(21);
  ib.cancelRealTimeBars(22);
  ib.cancelRealTimeBars(23);
  ib.cancelRealTimeBars(24);

  ib.disconnect();
}, 10000);
