/*
 * lib/controller.js
 */

'use strict';

var util = require('util');

var _ = require('lodash'),
    CommandBuffer = require('command-buffer');

var Connection = require('./connection'),
    Incoming = require('./incoming'),
    Outgoing = require('./outgoing');

function Controller(ib) {
  this._ib = ib;

  this._connection = new Connection(this._ib);
  this._incoming = new Incoming(this._ib);
  this._outgoing = new Outgoing(this._ib);

  this._commands = new CommandBuffer(function (type, data) {
    // console.log('PROCESS: %s, %s', type, JSON.stringify(data));
    var funcName = '_' + type;
    if (_.has(this.constructor.prototype, funcName) && _.isFunction(this[funcName])) {
      this[funcName](data);
    } else {
      throw new Error('Missing function - ' + funcName);
    }
  }, this);
}

Controller.prototype._api = function (data) {
  var func;
  if (_.has(this._outgoing.constructor.prototype, data.func)) {
    func = this._outgoing[data.func];
    if (_.isFunction(func)) {
      return func.apply(this._outgoing, data.args);
    }
  }
  throw new Error('Unknown outgoing func - ' + data.func);
};

Controller.prototype._connect = function () {
  this._connection.connect();
};

Controller.prototype._disconnect = function () {
  if (this._connection._connected) {
    this._connection.disconnect();
  } else {
    console.error(util.format('Cannot disconnect when not connected.').red);
  }
};

Controller.prototype._send = function (data, async) {
  if (this._connection._connected) {
    this._connection.send(data, async);
  } else {
    console.error(util.format('Cannot send when not connected: %s', data).red);
  }
};

Controller.prototype._sendAsync = function (data) {
  this._send(data, true);
};

Controller.prototype.pause = function () {
  this._commands.pause.apply(this._commands, arguments);
};

Controller.prototype.resume = function () {
  this._commands.resume.apply(this._commands, arguments);
};

Controller.prototype.run = function () {
  this._commands.run.apply(this._commands, arguments);
};

Controller.prototype.schedule = function () {
  this._commands.schedule.apply(this._commands, arguments);
};

// Public API
module.exports = exports = Controller;
