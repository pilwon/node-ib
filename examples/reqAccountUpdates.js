var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['accountDownloadEnd', 'updateAccountTime', 'updateAccountValue', 'updatePortfolio'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('accountDownloadEnd', function (accountName) {
  console.log(
    '%s %s%s',
    chalk.cyan('[accountDownloadEnd]'),
    chalk.bold('accountName='), accountName
  );
}).on('updateAccountTime', function (timeStamp) {
  console.log(
    '%s %s%s',
    chalk.cyan('[updateAccountTime]'),
    chalk.bold('timeStamp='), timeStamp
  );
}).on('updateAccountValue', function (key, value, currency, accountName) {
  console.log(
    '%s %s%s %s%s %s%s %s%s',
    chalk.cyan('[updateAccountValue]'),
    chalk.bold('key='), key,
    chalk.bold('value='), value,
    chalk.bold('currency='), currency,
    chalk.bold('accountName='), accountName
  );
}).on('updatePortfolio', function (contract, position, marketPrice, marketValue, averageCost, unrealizedPNL, realizedPNL, accountName) {
  console.log(
    '%s %s%s %s%d %s%d %s%d %s%d %s%d %s%d %s%s',
    chalk.cyan('[updatePortfolio]'),
    chalk.bold('contract='), JSON.stringify(contract),
    chalk.bold('position='), position,
    chalk.bold('marketPrice='), marketPrice,
    chalk.bold('marketValue='), marketValue,
    chalk.bold('averageCost='), averageCost,
    chalk.bold('unrealizedPNL='), unrealizedPNL,
    chalk.bold('realizedPNL='), realizedPNL,
    chalk.bold('accountName='), accountName
  );
});

ib.connect();

ib.reqAccountUpdates(true, 'U1234567');

ib.on('accountDownloadEnd', function () {
  console.log(chalk.yellow('Cancelling account updates subscription...'));
  ib.reqAccountUpdates(false, 'All');
  ib.disconnect();
});
