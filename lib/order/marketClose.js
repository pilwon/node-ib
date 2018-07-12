var assert = require('assert');

var _ = require('lodash');

module.exports = function (action, quantity, transmitOrder) {
  assert(_.isString(action), 'Action must be a string.');
  assert(_.isNumber(quantity), 'Quantity must be a number.');

  if (transmitOrder === undefined) {
    transmitOrder = true;
  }

  return {
    action: action,
    orderType: 'MOC',
    totalQuantity: quantity,
    transmit: transmitOrder
  };
};
