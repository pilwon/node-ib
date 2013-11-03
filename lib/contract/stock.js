/*
 * lib/contract/stock.js
 */

'use strict';

var assert = require('assert');

var _ = require('lodash');

function stock(symbol, exchange, currency) {
  assert(_.isString(symbol), 'Symbol must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'SMART',
    secType: 'STK',
    symbol: symbol
  };
}

// Public API
module.exports = exports = stock;
