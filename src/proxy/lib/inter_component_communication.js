'use strict';

require('dotenv').load();

var zmq = require('zmq'),
  newBlockchainSocket = zmq.socket('push'),
  cache = require('node-cache'),
  Util = require('../../shared/util/util.js');

var newBlockchainSocketString = process.env.NEW_BLOCKCHAIN_SOCKET;
var notificationCache = new cache( { stdTTL: 100, checkperiod: 120 } );

newBlockchainSocket.bindSync(newBlockchainSocketString);

exports.triggerBlockchainFetching = function(hostname) {
  if ( JSON.stringify(notificationCache.get(hostname)) === '{}' ) {
    notificationCache.set(hostname, Util.timestamp());
    newBlockchainSocket.send(JSON.stringify({
      "hostname": hostname
    }));
  }
};
