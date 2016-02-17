var assert = require('assert');

var _ = require('lodash');

// Between two currencies,
// Whatever currency comes first should be in "symbol" and the other one must be in "currency".
// EUR GBP AUD USD TRY ZAR CAD CHF MXN HKD JPY INR NOK SEK RUB

var CURRENCIES = [
  'KRW', 'EUR', 'GBP', 'AUD',
  'USD', 'TRY', 'ZAR', 'CAD', 
  'CHF', 'MXN', 'HKD', 'JPY', 
  'INR', 'NOK', 'SEK', 'RUB'
];

module.exports = function (symbol, currency) {
  assert(_.isString(symbol), 'Symbol must be a string.');
  if (!_.isString(currency)) { currency = 'USD'; }

  var temp;

  // Swap between symbol and currency if the ordering is incorrect.
  if (CURRENCIES.indexOf(symbol) > CURRENCIES.indexOf(currency)) {
    temp = symbol;
    symbol = currency;
    currency = temp;
  }

  return {
    currency: currency,
    exchange: 'IDEALPRO',
    secType: 'CASH',
    symbol: symbol
  };
};
