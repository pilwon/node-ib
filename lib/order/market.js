/*
 * lib/order/market.js
 */

'use strict';

var assert = require('assert');

var _ = require('lodash');

function market(action, quantity, transmitOrder) {
    assert(_.isString(action), 'Action must be a string.');
    assert(_.isNumber(quantity), 'Quantity must be a string.');
    
  if (transmitOrder === undefined) {
    transmitOrder = true;
  }

    return {
        action: action,
        orderType: 'MKT',
        totalQuantity: quantity,
        transmit: transmitOrder 
    };
}

// Public API
module.exports = exports = market;
