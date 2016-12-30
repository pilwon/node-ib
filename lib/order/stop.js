var assert = require('assert');

var _ = require('lodash');

module.exports = function (action, quantity, price, transmitOrder, parentId) {
  assert(_.isString(action), 'Action must be a string.');
  assert(_.isNumber(quantity), 'Quantity must be a number.');
  assert(_.isNumber(price), 'Price must be a number.');

  return {
    action: action,
    auxPrice: price,
    orderType: 'STP',
    totalQuantity: quantity,
    transmit: transmitOrder || true,
    parentId: parentId || 0
  };
};
