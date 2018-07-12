var _ = require('lodash');
var chalk = require('chalk');

var ib = new(require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 4003
}).on('error', (err) => {
  console.error(chalk.red(err.message));
}).on('historicalTickTradeData', (...data) => {
  console.log(
    '%s %s%d %s%s %s%d %s%d %s%d %s%s %s%s',
    chalk.cyan('[historicalTickTradeData]'),
    chalk.bold('reqId='), data[0],
    chalk.bold('timestamp='), data[1],
    chalk.bold('mask='), data[2],
    chalk.bold('price='), data[3],
    chalk.bold('size='), data[4],
    chalk.bold('exchange='), data[5],
    chalk.bold('specialConditions='), data[6],
  );
}).on('historicalTickBidAskData', (...data) => {
  console.log(
    '%s %s%d %s%s %s%d %s%d %s%d %s%d %s%d',
    chalk.cyan('[historicalTickBidAskData]'),
    chalk.bold('reqId='), data[0],
    chalk.bold('timestamp='), data[1],
    chalk.bold('mask='), data[2],
    chalk.bold('priceBid='), data[3],
    chalk.bold('priceAsk='), data[4],
    chalk.bold('sizeBid='), data[5],
    chalk.bold('sizeAsk='), data[6],
  );
}).on('historicalTickMidPointData', (...data) => {
    console.log(
      '%s %s%d %s%s %s%d %s%d',
      chalk.cyan('[historicalTickMidPointData]'),
      chalk.bold('reqId='), data[0],
      chalk.bold('timestamp='), data[1],
      chalk.bold('price='), data[2],
      chalk.bold('size='), data[3]
    );
  });


ib.connect();

// tickerId, contract, startDateTime, endDateTime, numberOfTicks, whatToShow, useRTH, ignoreSize
ib.reqHistoricalTicks(1, ib.contract.stock('SPY', 'SMART', 'USD'), '20180711 12:00:00', null, 10, 'TRADES', 1, false);
ib.reqHistoricalTicks(2, ib.contract.stock('SPY', 'SMART', 'USD'), '20180711 12:00:00', null, 10, 'BID_ASK', 1, false);
ib.reqHistoricalTicks(3, ib.contract.stock('SPY', 'SMART', 'USD'), '20180711 12:00:00', null, 10, 'MIDPOINT', 1, false);


ib.on('historicalTickDataEnd', (reqId) => {
  console.log(
    '%s %s%d',
    chalk.cyan('[historicalTickDataEnd]'),
    chalk.bold('reqId='), reqId
  );
});
