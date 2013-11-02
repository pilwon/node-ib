/*
 * lib/controller.js
 */

'use strict';

var util = require('util');

var _ = require('lodash'),
    CommandBuffer = require('command-buffer');

var C = require('./constants'),
    Socket = require('./socket'),
    Incoming = require('./incoming'),
    Outgoing = require('./outgoing');

function Controller(ib, options) {
  if (!_.isPlainObject(options)) { options = {}; }

  _.defaults(options, {
    host: C.DEFAULT_HOST,
    port: C.DEFAULT_PORT,
    clientId: C.DEFAULT_CLIENT_ID,
  });

  Object.defineProperty(this, 'options', {
    get: function () {
      return options;
    }
  });

  this._ib = ib;
  this._serverVersion = null;
  this._serverConnectionTime = null;

  this._socket = new Socket(this);
  this._incoming = new Incoming(this);
  this._outgoing = new Outgoing(this);

  this._commands = new CommandBuffer(function (type, data) {
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
  this._socket.connect();
};

Controller.prototype._disconnect = function () {
  if (this._socket._connected) {
    this._socket.disconnect();
  } else {
    this.emitError('Cannot disconnect if already disconnected.');
  }
};

Controller.prototype._send = function (data, async) {
  if (this._socket._connected) {
    this._socket.send(data, async);
  } else {
    this.emitError('Cannot send data when disconnected.');
  }
};

Controller.prototype._sendAsync = function (data) {
  this._send(data, true);
};

Controller.prototype.emit = function () {
  var args = Array.prototype.slice.call(arguments);

  if (args[0] === 'error' && !!args[1] && args[1].message) {
    args[1] = args[1].message;
  }

  this._ib.emit.apply(this._ib, arguments);

  var eventOfArgs = args[0],
      argsOfArgs = args.slice(1);

  if (!_.contains(['connected', 'disconnected', 'error', 'received', 'sent', 'server'], eventOfArgs)) {
    this._ib.emit('result', eventOfArgs, argsOfArgs);
  }

  this._ib.emit('all', eventOfArgs, argsOfArgs);
};

Controller.prototype.emitError = function (errMsg, data) {
  this.emit('error', new Error(errMsg), data);
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
