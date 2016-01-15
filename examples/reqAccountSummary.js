require('colors');

var _ = require('lodash');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(err.message.red);
}).on('result', function (event, args) {
  if (!_.contains(['accountSummary', 'accountSummaryEnd'], event)) {
    console.log('%s %s', (event + ':').yellow, JSON.stringify(args));
  }
}).on('accountSummary', function (reqId, account, tag, value, currency) {
  console.log(
    '%s %s%d %s%s %s%s %s%s %s%s',
    '[accountSummary]'.cyan,
    'reqId='.bold, reqId,
    'account='.bold, account,
    'tag='.bold, tag,
    'value='.bold, value,
    'currency='.bold, currency
  );
}).on('accountSummaryEnd', function (reqId) {
  console.log(
    '%s %s%d',
    '[accountSummaryEnd]'.cyan,
    'reqId='.bold, reqId
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
  console.log('Cancelling real-time bars subscription...'.yellow);
  ib.cancelAccountSummary(1);
  ib.disconnect();
});
