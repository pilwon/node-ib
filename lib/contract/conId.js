var assert = require('assert');

var _ = require('lodash');

module.exports = function (conId, exchange) {
  assert(_.isNumber(conId), 'conId must be a number.');
  assert(_.isString(exchange), 'Symbol must be a string.');

  return {
    conId: conId,
    exchange: exchange || 'SMART',
  };
};
