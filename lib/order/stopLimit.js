var assert = require('assert');

var _ = require('lodash');

module.exports = function (action, quantity, limitPrice, stopPrice, transmitOrder, parentId) {
  assert(_.isString(action), 'Action must be a string.');
  assert(_.isNumber(quantity), 'Quantity must be a string.');
  assert(_.isNumber(stopPrice), 'Stop price must be a number.');
  assert(_.isNumber(limitPrice), 'Limit price must be a number.');

  return {
    action: action,
    lmtPrice: limitPrice,
    auxPrice: stopPrice,
    orderType: 'STP LMT',
    totalQuantity: quantity,
    transmit: transmitOrder || true,
    parentId: parentId || 0
  };
};
