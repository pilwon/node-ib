/*
 * lib/contract/combo.js
 */

'use strict';

var assert = require('assert');

var _ = require('lodash');

function combo(symbol, currency, exchange) {
  assert(_.isString(symbol), 'Symbol must be a string.');

  return {
    currency: currency || 'USD',
    exchange: exchange || 'SMART',
    secType: 'BAG',
    symbol: symbol
  };
}

// Public API
module.exports = exports = combo;
