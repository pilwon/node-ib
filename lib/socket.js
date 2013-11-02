/*
 * lib/socket.js
 */

'use strict';

var net = require('net'),
    util = require('util');

var _ = require('lodash');

var C = require('./constants');

var EOL = '\0';

function Socket(controller) {
  this._controller = controller;

  this._client = null;
  this._connected = false;
  this._neverReceived = true;
  this._neverSent = true;
  this._waitingAsync = false;
}

Socket.prototype._onConnect = function () {
  console.info('CONNECTED'.rainbow);
  this._connected = true;

  this._controller.run('sendAsync', [C.CLIENT_VERSION, this._controller.options.clientId]);
};

Socket.prototype._onData = function (data) {
  var tokens = data.toString().split(EOL).slice(0, -1),
      tokensCopy = tokens.slice(0);

  // Log
  if (!this._neverReceived) {
    tokensCopy[0] = parseInt(tokensCopy[0], 10);
    var temp = this._controller.findKeyForValue(C.INCOMING, tokensCopy[0]);
    if (temp) { tokensCopy[0] = temp; }
  }
  console.info(('RECV: ' + JSON.stringify(tokensCopy)).cyan);

  // Process data queue
  this._controller._incoming.enqueue(tokens);

  if (this._neverReceived) {
    // Update server version
    this._controller._serverVersion = parseInt(this._controller._incoming.dequeue(), 10);
    console.info(util.format(
      'Server Version: %s',
      this._controller._serverVersion
    ).rainbow);

    // Update server connection time
    this._controller._serverConnectionTime = this._controller._incoming.dequeue();
    console.info(util.format(
      'Server Connection Time: %s',
      this._controller._serverConnectionTime
    ).rainbow);
  }

  this._controller._incoming.process();

  // Async
  if (this._waitingAsync) {
    this._waitingAsync = false;
    this._controller.resume();
  }

  this._neverReceived = false;
};

Socket.prototype._onEnd = function () {
  this._connected = false;
  console.info('DISCONNECTED'.rainbow);
  this._controller.resume();
};

Socket.prototype._onError = function (err) {
  switch (err.code) {
  case 'ECONNREFUSED':
    console.error('ECONNREFUSED'.rainbow);
    return;
  default:
    throw err;
  }
};

Socket.prototype.connect = function () {
  var self = this;

  this._controller.pause();

  this._neverReceived = true;
  this._neverSent = true;

  this._client = net.connect({
    host: this._controller.options.host,
    port: this._controller.options.port
  }, function () {
    self._onConnect.apply(self, arguments);
    self._controller.resume();
  });

  this._client.on('data', function () {
    self._onData.apply(self, arguments);
  });

  this._client.on('end', function () {
    self._onEnd.apply(self, arguments);
  });

  this._client.on('error', function () {
    self._onError.apply(self, arguments);
  });
};

Socket.prototype.disconnect = function () {
  this._controller.pause();
  this._client.end();
};

Socket.prototype.send = function (data, async) {
  if (async) {
    this._waitingAsync = true;
    this._controller.pause();
  }

  data = _.flatten([data]);

  _.each(data, function (val, idx) {
    if (_.isBoolean(val)) {
      data[idx] = val ? 1 : 0;
    }
  });

  data = data.join(EOL) + EOL;
  this._client.write(data);

  // Log
  var tokens = data.split(EOL).slice(0, -1);
  if (!this._neverSent) {
    tokens[0] = parseInt(tokens[0], 10);
    var temp = this._controller.findKeyForValue(C.OUTGOING, tokens[0]);
    if (temp) { tokens[0] = temp; }
  }
  console.info(('SENT: ' + JSON.stringify(tokens)).yellow);

  this._neverSent = false;
};

// Public API
module.exports = exports = Socket;
