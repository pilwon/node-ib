var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['accountSummary', 'accountSummaryEnd'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('accountSummary', function (reqId, account, tag, value, currency) {
  console.log(
    '%s %s%d %s%s %s%s %s%s %s%s',
    chalk.cyan('[accountSummary]'),
    chalk.bold('reqId='), reqId,
    chalk.bold('account='), account,
    chalk.bold('tag='), tag,
    chalk.bold('value='), value,
    chalk.bold('currency='), currency
  );
}).on('accountSummaryEnd', function (reqId) {
  console.log(
    '%s %s%d',
    chalk.cyan('[accountSummaryEnd]'),
    chalk.bold('reqId='), reqId
  );
});

ib.connect();

ib.reqAccountSummary(1, 'All', [
  'AccountType',
  'NetLiquidation',
  'TotalCashValue',
  'SettledCash',
  'AccruedCash',
  'BuyingPower',
  'EquityWithLoanValue',
  'PreviousEquityWithLoanValue',
  'GrossPositionValue',
  'RegTEquity',
  'RegTMargin',
  'SMA',
  'InitMarginReq',
  'MaintMarginReq',
  'AvailableFunds',
  'ExcessLiquidity',
  'Cushion',
  'FullInitMarginReq',
  'FullMaintMarginReq',
  'FullAvailableFunds',
  'FullExcessLiquidity',
  'LookAheadNextChange',
  'LookAheadInitMarginReq',
  'LookAheadMaintMarginReq',
  'LookAheadAvailableFunds',
  'LookAheadExcessLiquidity',
  'HighestSeverity',
  'DayTradesRemaining',
  'Leverage'
]);

ib.on('accountSummaryEnd', function () {
  console.log(chalk.yellow('Cancelling account summary request...'));
  ib.cancelAccountSummary(1);
  ib.disconnect();
});
