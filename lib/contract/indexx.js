var assert = require('assert');

var _ = require('lodash');

module.exports = function (symbol, expiry, currency, exchange) {
  assert(_.isString(symbol), 'Symbol must be a string.');
  assert(_.isString(expiry), 'Expiry must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'CBOE',
    expiry: expiry,
    secType: 'IND',
    symbol: symbol
  };
};
