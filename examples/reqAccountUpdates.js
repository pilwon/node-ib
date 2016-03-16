require('colors');
var _ = require('lodash');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(err.message.red);
}).on('result', function (event, args) {
  if (!_.includes(['accountDownloadEnd', 'updateAccountTime', 'updateAccountValue', 'updatePortfolio'], event)) {
    console.log('%s %s', (event + ':').yellow, JSON.stringify(args));
  }
}).on('accountDownloadEnd', function (accountName) {
  console.log(
    '%s %s%s',
    '[accountDownloadEnd]'.cyan,
    'accountName='.bold, accountName
  );
}).on('updateAccountTime', function (timeStamp) {
  console.log(
    '%s %s%s',
    '[updateAccountTime]'.cyan,
    'timeStamp='.bold, timeStamp
  );
}).on('updateAccountValue', function (key, value, currency, accountName) {
  console.log(
    '%s %s%s %s%s %s%s %s%s',
    '[updateAccountValue]'.cyan,
    'key='.bold, key,
    'value='.bold, value,
    'currency='.bold, currency,
    'accountName='.bold, accountName
  );
}).on('updatePortfolio', function (contract, position, marketPrice, marketValue, averageCost, unrealizedPNL, realizedPNL, accountName) {
  console.log(
    '%s %s%s %s%d %s%d %s%d %s%d %s%d %s%d %s%s',
    '[updatePortfolio]'.cyan,
    'contract='.bold, JSON.stringify(contract),
    'position='.bold, position,
    'marketPrice='.bold, marketPrice,
    'marketValue='.bold, marketValue,
    'averageCost='.bold, averageCost,
    'unrealizedPNL='.bold, unrealizedPNL,
    'realizedPNL='.bold, realizedPNL,
    'accountName='.bold, accountName
  );
});

ib.connect();

ib.reqAccountUpdates(true, 'U1234567');

ib.on('accountDownloadEnd', function () {
  console.log('Cancelling account updates subscription...'.yellow);
  ib.reqAccountUpdates(false, 'All');
  ib.disconnect();
});
