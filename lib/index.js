/*
 * lib/index.js
 */

'use strict';

function IB() {

}

IB.prototype.connect = function () {
  console.log('connect');
};

// Public API
module.exports = exports = IB;
