var _ = require('lodash');
var chalk = require('chalk');

var ib = new (require('..'))({
  // clientId: 0,
  // host: '127.0.0.1',
  port: 7497
}).on('error', function (err) {
  console.error(chalk.red(err.message));
}).on('result', function (event, args) {
  if (!_.includes(['accountUpdateMulti', 'accountUpdateMultiEnd'], event)) {
    console.log('%s %s', chalk.yellow(event + ':'), JSON.stringify(args));
  }
}).on('accountUpdateMultiEnd', function (reqId) {
  console.log(
    '%s %s%s',
    chalk.cyan('[accountUpdateMultiEnd]'),
    chalk.bold('reqId='), reqId
  );
}).on('accountUpdateMulti', function (reqId, account, modelCode, key, value, currency) {
  console.log(
    '%s %s%s %s%s %s%s %s%s %s%s %s%s',
    chalk.cyan('[accountUpdateMulti]'),
    chalk.bold('reqId='), reqId,
    chalk.bold('account='), account,
    chalk.bold('modelCode='), modelCode,
    chalk.bold('key='), key,
    chalk.bold('value='), value,
    chalk.bold('currency='), currency
  );
});

ib.connect();

var requestId = 0;
ib.once('nextValidId', function (reqId) {
  requestId = reqId;
  ib.reqAccountUpdatesMulti(reqId, 'U1234567', null, false);
});

ib.on('accountUpdateMultiEnd', function () {
  console.log(chalk.yellow('Cancelling account updates subscription...'));
  ib.cancelAccountUpdatesMulti(requestId);
  ib.disconnect();
});
