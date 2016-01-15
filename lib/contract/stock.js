var assert = require('assert');

var _ = require('lodash');

module.exports = function (symbol, exchange, currency) {
  assert(_.isString(symbol), 'Symbol must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'SMART',
    secType: 'STK',
    symbol: symbol
  };
};
