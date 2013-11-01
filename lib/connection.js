/*
 * lib/connection.js
 */

'use strict';

var net = require('net');

var _ = require('lodash');

var C = require('./constants');

function Connection(ib) {
  this._ib = ib;

  this._client = null;
  this._connected = false;
  this._dataQueue = [];

  this._waitingAsync = false;
}

Connection.prototype._onConnect = function () {
  console.info('CONNECTED'.rainbow);
  this._connected = true;

  this._ib._controller.run('sendAsync', [C.CLIENT_VERSION, this._ib._options.clientId]);
};

Connection.prototype._onData = function (data) {
  var tokens = data.toString().split(C.EOL).slice(0, -1);
  this._dataQueue = this._dataQueue.concat(tokens);

  // Process
  tokens[0] = parseInt(tokens[0], 10);
  if (tokens[0] === C.INCOMING.NEXT_VALID_ID) {
    this._ib.emit('nextValidId', tokens[1]);
  }

  // Log
  var temp = C.INCOMING.get(tokens[0]);
  if (temp) { tokens[0] = temp; }
  console.info(('RECV: ' + JSON.stringify(tokens)).cyan);

  if (this._waitingAsync) {
    this._waitingAsync = false;
    this._ib._controller.resume();
  }
};

Connection.prototype._onEnd = function () {
  this._connected = false;
  console.info('DISCONNECTED'.rainbow);
  this._ib._controller.resume();
};

Connection.prototype.connect = function () {
  var self = this;

  this._ib._controller.pause();

  this._client = net.connect({
    host: this._ib._options.host,
    port: this._ib._options.port
  }, function () {
    self._onConnect.apply(self, arguments);
    self._ib._controller.resume();
  });

  this._client.on('data', function () {
    self._onData.apply(self, arguments);
  });

  this._client.on('end', function () {
    self._onEnd.apply(self, arguments);
  });
};

Connection.prototype.disconnect = function () {
  this._ib._controller.pause();
  this._client.end();
};

Connection.prototype.send = function (data, async) {
  if (async) {
    this._waitingAsync = true;
    this._ib._controller.pause();
  }

  data = _.flatten([data]).join(C.EOL) + C.EOL;
  this._client.write(data);

  // Log
  var tokens = data.split(C.EOL).slice(0, -1);
  tokens[0] = parseInt(tokens[0], 10);
  var temp = C.OUTGOING.get(tokens[0]);
  if (temp) { tokens[0] = temp; }
  console.info(('SENT: ' + JSON.stringify(tokens)).yellow);
};

// Public API
module.exports = exports = Connection;
