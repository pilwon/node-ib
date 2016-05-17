var assert = require('assert');

var _ = require('lodash');

module.exports = function (symbol, expiry, strike, right, multiplier, exchange, currency) {
  assert(_.isString(right), 'Right must be a string.');
  assert(_.isString(symbol), 'Symbol must be a string.');
  assert(_.isString(expiry), 'Expiry must be a string.');
  assert(_.isNumber(strike), 'Strike must be a number.');

  return {
    currency: currency || 'USD',
    exchange: exchange ||'GLOBEX',
    expiry: expiry,
    multiplier: multiplier || 50,
    right: right,
    secType: 'FOP',
    strike: strike,
    symbol: symbol
  };
};

