var assert = require('assert');

var _ = require('lodash');

module.exports = function (action, quantity, transmitOrder, goodAfterTime, goodTillDate, account, tif) {
  assert(_.isString(action), 'Action must be a string.');
  assert(_.isNumber(quantity), 'Quantity must be a number.');

  if (transmitOrder === undefined) {
    transmitOrder = true;
  }

  if ( goodAfterTime === undefined ) {
    goodAfterTime = '';
  }

  if ( goodTillDate === undefined ) {
    goodTillDate = '';
  }

  return {
    action: action,
    orderType: 'MKT',
    totalQuantity: quantity,
    transmit: transmitOrder,
    goodAfterTime: goodAfterTime,
    goodTillDate: goodTillDate,
    account: account,
    tif: tif
  };
};
