'use strict';

var zmq = require('zmq'),
  newBlockchainSocket = zmq.socket('push'),
  cache = require('node-cache'),
  util = require('../lib/util.js');

var newBlockchainSocketString = process.env.NEW_BLOCKCHAIN_SOCKET;
var notificationCache = new cache( { stdTTL: 100, checkperiod: 120 } );

newBlockchainSocket.bindSync(newBlockchainSocketString);

exports.triggerBlockchainFetching = function(hostname) {
  var magicno = util.doubleSha256(hostname).toString('hex');

  if ( JSON.stringify(notificationCache.get(hostname)) === '{}' ) {
    notificationCache.set(hostname, magicno);
    newBlockchainSocket.send(JSON.stringify({
      "hostname": hostname,
      "magicno": magicno
    }));
  }
};
