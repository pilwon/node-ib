var assert = require('assert');

var _ = require('lodash');

module.exports = function (action, quantity, auxPrice, tif, transmitOrder, parentId) {
  assert(_.isString(action), 'Action must be a string.');
  assert(_.isNumber(quantity), 'Quantity must be a number.');
  assert(_.isNumber(auxPrice), 'Price must be a number.');

  if (transmitOrder === undefined) {
    transmitOrder = true;
  }

  return {
    action: action,
    totalQuantity: quantity,
    orderType: 'TRAIL',  // https://www.interactivebrokers.com/en/software/api/apiguide/tables/supported_order_types.htm
    auxPrice: auxPrice,
    tif: tif,  // note - TRAIL orders are only triggered during the trading hours of the contract
    transmit: transmitOrder,
    parentId: parentId || 0
  };
};
