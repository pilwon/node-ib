var assert = require('assert');

var _ = require('lodash');

module.exports = function (symbol, exchange, currency, primaryExch) {
  assert(_.isString(symbol), 'Symbol must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'SMART',
    primaryExch: primaryExch,
    secType: 'STK',
    symbol: symbol
  };
};
