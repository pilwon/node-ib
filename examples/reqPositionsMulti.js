var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  port: 7497
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['positionMulti', 'positionMultiEnd'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('positionMulti', function (reqId, account, modelCode, contract, pos, avgCost) {
  console.log(
    '%s %s%s %s%s %s%s %s%s %s%s %s%s',
    chalk.cyan('[positionMulti]'),
    chalk.bold('reqId='), reqId,
    chalk.bold('account='), account,
    chalk.bold('modelCode='), modelCode,
    chalk.bold('contract='), JSON.stringify(contract),
    chalk.bold('pos='), pos,
    chalk.bold('avgCost='), avgCost
  );
}).on('positionMultiEnd', function (reqId) {
  console.log(
    '%s %s%s',
    chalk.cyan('[positionMultiEnd]'),
    chalk.bold('reqId='), reqId
  );
});

ib.connect();

var requestId = 0;
ib.once('nextValidId', function (reqId) {
  requestId = reqId;
  ib.reqPositionsMulti(reqId, 'U1234567', null);
});

ib.on('positionMultiEnd', function () {
  console.log(chalk.yellow('Cancelling position multi subscription...'));
  ib.cancelPositionsMulti(requestId);
  ib.disconnect();
});
