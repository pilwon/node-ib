var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['contractDetails', 'contractDetailsEnd'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('contractDetails', function (reqId, contract) {
  console.log(
    '%s %s%s %s%s',
    chalk.cyan('[contractDetails]'),
    'reqId='.bold, reqId,
    'contract='.bold, JSON.stringify(contract)
  );
}).on('contractDetailsEnd', function (reqId) {
  console.log(
    '%s %s%s',
    chalk.cyan('[contractDetailsEnd]'),
    'reqId='.bold, reqId
  );
});

ib.connect();

// Forex
ib.reqContractDetails(1, ib.contract.forex('EUR'));
ib.reqContractDetails(2, ib.contract.forex('GBP'));
ib.reqContractDetails(3, ib.contract.forex('CAD'));
ib.reqContractDetails(4, ib.contract.forex('HKD'));
ib.reqContractDetails(5, ib.contract.forex('JPY'));
ib.reqContractDetails(6, ib.contract.forex('KRW'));

// Stock
ib.reqContractDetails(11, ib.contract.stock('AAPL'));
ib.reqContractDetails(12, ib.contract.stock('AMZN'));
ib.reqContractDetails(13, ib.contract.stock('GOOG'));
ib.reqContractDetails(14, ib.contract.stock('FB'));

// Option
ib.reqContractDetails(21, ib.contract.option('AAPL', '201407', 500, 'C'));
ib.reqContractDetails(22, ib.contract.option('AMZN', '201404', 350, 'P'));
ib.reqContractDetails(23, ib.contract.option('GOOG', '201406', 1000, 'C'));
ib.reqContractDetails(24, ib.contract.option('FB', '201406', 50, 'P'));

var NUM_CONTRACTS = 6 + 4 + 4;
var count = 0;
ib.on('contractDetailsEnd', function () {
  if (++count >= NUM_CONTRACTS) {
    ib.disconnect();
  }
});
