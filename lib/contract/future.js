var assert = require('assert');

var _ = require('lodash');

module.exports = function (symbol, expiry, currency, exchange, multiplier) {
  assert(_.isString(symbol), 'Symbol must be a string.');
  assert(_.isString(expiry), 'Expiry must be a string.');

  return {
    secType: 'FUT',
    symbol: symbol,
    expiry: expiry,
    currency: currency || 'USD',
    exchange: exchange || 'ONE',
    multiplier: multiplier || 50,
  };
};
