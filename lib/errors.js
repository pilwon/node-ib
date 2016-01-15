/*
 * lib/errors.js
 */

'use strict';

function UnderrunError(message) {
  this.name = 'UnderrunError';
  this.message = message || 'An underrun error has occurred';
  this.stack = (new Error()).stack;
}
UnderrunError.prototype = Object.create(Error.prototype);
UnderrunError.prototype.constructor = UnderrunError;

// Add additional custom error messages here

module.exports = {
    UnderrunError: UnderrunError
};
