var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['position', 'positionEnd'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('position', function (account, contract, pos, avgCost) {
  console.log(
    '%s %s%s %s%s %s%s %s%s',
    chalk.cyan('[position]'),
    'account='.bold, account,
    'contract='.bold, JSON.stringify(contract),
    'pos='.bold, pos,
    'avgCost='.bold, avgCost
  );
}).on('positionEnd', function () {
  console.log(chalk.cyan('[positionEnd]'));
});

ib.connect();

ib.reqPositions();

ib.on('positionEnd', function () {
  ib.disconnect();
});
