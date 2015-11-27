/*
 * lib/order/stopLimit.js
 */

'use strict';

var assert = require('assert');

var _ = require('lodash');

function stopLimit(action, quantity, limitPrice, stopPrice, transmitOrder) {
    assert(_.isString(action), 'Action must be a string.');
    assert(_.isNumber(quantity), 'Quantity must be a string.');
    assert(_.isNumber(stopPrice), 'Stop price must be a number.');
    assert(_.isNumber(limitPrice), 'Limit price must be a number.');
    
  if (transmitOrder === undefined) {
    transmitOrder = true;
  }

    return {
        action: action,
        lmtPrice: limitPrice,
        auxPrice: stopPrice,
        orderType: 'STP LMT',
        totalQuantity: quantity,
        transmit: transmitOrder 
    };
}

// Public API
module.exports = exports = stopLimit;
