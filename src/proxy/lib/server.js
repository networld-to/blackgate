'use strict';

/**
 * TCP Socket (8080) -> Smart Proxy       -> HTTP Server
 * TCP Socket (8080) -> Transparent Proxy -> HTTPS Server
 *
 * Smart Proxy integrates with BlackGate and verifies the checksums from the
 * related blockchain. The Transparent Proxy only forwards the content without
 * intercepting it, needed for TLS connections.
 *
 * Only HTTP connections of pages that have a related blockchain are checked.
 */

var net = require('net');
var http = require('http');
var url = require('url');
var request = require('request');
var Agent = require('socks5-http-client/lib/Agent');

var crypto = require('crypto');

var log = require('../lib/logger');
var Util = require('../../shared/util/util.js');
var icc = require('../lib/inter_component_communication');

/**
 * HTTP Proxy
 */
this.server = http.createServer(function(req, resp) {
  var link = req.url;
  var host = req.headers.host;
  var proxy = request({
    url: link,
    encoding: 'binary',
    agentClass: Agent,
    agentOptions: {
      socksHost: '127.0.0.1',
      socksPort: 9052, // Defaults to 1080.
    }
  }, function(err, res) {
    if (err) {
      log.error("[!] Request error: %s", err);
      return;
    }
    var result = crypto.createHash("sha256").update(res.body, "binary").digest('hex');
    resp.headers = res.headers;
    resp.end(res.body, 'binary');

    icc.triggerBlockchainFetching(host);

    log.debug('');
    log.debug("Hostname         : %s", host);
    log.debug("MagicNo          : 0x%s", Util.doubleSha256(host).toString('hex'));
    log.debug("Requested Content: %s", link.toString());
    log.debug("Response Checksum: 0x%s", result.toString());
  });

});

/**
 * CONNECT requests are directlyy forwarded to the host, without interception.
 * Most times that are HTTPS connections.
 */
this.server.on('connect', function(req, cltSocket, head) {
  // connect to an origin server
  var srvUrl = url.parse('http://' + req.url);
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function() {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
        'Proxy-Agent: BlackGate-Proxy <http://blackgate.networld.to>\r\n' +
        '\r\n');
    srvSocket.write(head, 'binary');
    srvSocket.pipe(cltSocket);
    cltSocket.pipe(srvSocket);
  });
});

exports.listen = function() {
  this.server.listen.apply(this.server, arguments);
};

exports.close = function (callback) {
  this.server.close(callback);
};
