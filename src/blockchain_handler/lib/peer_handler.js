var log = require('./logger');

var PeerHandler = exports.PeerHandler = function PeerHandler() { };

/**
 * During the handshake (VERSION/VERSION_ACK) the hostnames have to be
 * exchanged. More specifically that means that the connecting host has to
 * share its hostname in the VERSION message.
 */
PeerHandler.addPeer = function(hostname) {
  log.error("TODO: Add the following peer to the peer list: " + hostname);
};
