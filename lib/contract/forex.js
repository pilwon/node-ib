var assert = require('assert');

var _ = require('lodash');

module.exports = function (symbol, currency) {
  assert(_.isString(symbol), 'Symbol must be a string.');
  if (!_.isString(currency)) { currency = 'USD'; }

  return {
    currency: currency,
    exchange: 'IDEALPRO',
    secType: 'CASH',
    symbol: symbol
  };
};
