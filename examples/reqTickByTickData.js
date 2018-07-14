var _ = require('lodash');
var chalk = require('chalk');

var ib = new(require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 4003
}).on('error', (err) => {
  console.error(chalk.red(err.message));
}).on('tickByTickAllLast', (...data) => {
  console.log(
    '%s %s%d %s%d %s%d %s%d %s%s %s%s %s%s',
    chalk.cyan('[tickByTickAllLast]'),
    chalk.bold('reqId='), data[0],
    chalk.bold('tickType='), data[1],
    chalk.bold('timestamp='), data[2],
    chalk.bold('price='), data[3],
    chalk.bold('size='), data[4],
    chalk.bold('attributes='), JSON.stringify(data[5]),
    chalk.bold('exchange='), data[6],
    chalk.bold('specialConditions='), data[7],
  );
}).on('tickByTickBidAsk', (...data) => {
  console.log(
    '%s %s%d %s%s %s%d %s%d %s%d %s%d %s%s',
    chalk.cyan('[tickByTickBidAsk]'),
    chalk.bold('reqId='), data[0],
    chalk.bold('timestamp='), data[1],
    chalk.bold('priceBid='), data[2],
    chalk.bold('priceAsk='), data[3],
    chalk.bold('sizeBid='), data[4],
    chalk.bold('sizeAsk='), data[5],
    chalk.bold('attributes='), JSON.stringify(data[6]),
  );
}).on('tickByTickMidPoint', (...data) => {
  console.log(
    '%s %s%d %s%s %s%d',
    chalk.cyan('[tickByTickMidPoint]'),
    chalk.bold('reqId='), data[0],
    chalk.bold('timestamp='), data[1],
    chalk.bold('midpoint='), data[2],
  );
});

ib.connect();

// tickerId, contract, tick type (BidAsk, Last, AllLast, MidPoint), numberOfTicks, ignoreSize
ib.reqTickByTickData(1, ib.contract.stock('SPY', 'SMART', 'USD'), 'BidAsk', 0, false)
//ib.reqTickByTickData(1, ib.contract.stock('SPY', 'SMART', 'USD'), 'AllLast', 0, false)
//ib.reqTickByTickData(1, ib.contract.stock('SPY', 'SMART', 'USD'), 'Last', 0, false)
//ib.reqTickByTickData(1, ib.contract.stock('SPY', 'SMART', 'USD'), 'MidPoint', 0, false)

setTimeout(() => {
  console.log(
    '%s %s%d',
    chalk.cyan('sending [cancelTickByTickData]'),
    chalk.bold('reqId='), 1);

  ib.cancelTickByTickData(1);
  ib.disconnect();
}, 5000);

//
// [tickByTickBidAsk]   reqId=1 timestamp=1531426792 priceBid=279.15 priceAsk=279.18 sizeBid=200 sizeAsk=3100 attributes={"bidPastLow":false,"askPastHigh":false}
// [tickByTickAllLast]  reqId=1 tickType=2 timestamp=1531426753 price=279.15 size=200 attributes={"pastLimit":false,"unreported":false} exchange=BATS specialConditions= T
// [tickByTickAllLast]  reqId=1 tickType=1 timestamp=1531426672 price=279.15 size=213 attributes={"pastLimit":false,"unreported":false} exchange=BATS specialConditions= FT
// [tickByTickMidPoint] reqId=1 timestamp=1531426697 midpoint=279.16
//