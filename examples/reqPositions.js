require('colors');
var _ = require('lodash');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  // port: 7496
}).on('error', function (err) {
  console.error(err.message.red);
}).on('result', function (event, args) {
  if (!_.contains(['position', 'positionEnd'], event)) {
    console.log('%s %s', (event + ':').yellow, JSON.stringify(args));
  }
}).on('position', function (account, contract, pos, avgCost) {
  console.log(
    '%s %s%s %s%s %s%s %s%s',
    '[position]'.cyan,
    'account='.bold, account,
    'contract='.bold, JSON.stringify(contract),
    'pos='.bold, pos,
    'avgCost='.bold, avgCost
  );
}).on('positionEnd', function () {
  console.log('[positionEnd]'.cyan);
});

ib.connect();

ib.reqPositions();

ib.on('positionEnd', function () {
  ib.disconnect();
});
