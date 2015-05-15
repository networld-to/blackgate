'use strict'

###
# TCP Socket (8080) -> Smart Proxy       -> HTTP Server
# TCP Socket (8080) -> Transparent Proxy -> HTTPS Server
#
# Smart Proxy integrates with BlackGate and verifies the checksums from the
# related blockchain. The Transparent Proxy only forwards the content without
# intercepting it, needed for TLS connections.
#
# Only HTTP connections of pages that have a related blockchain are checked.
###

net = require 'net'
http = require 'http'
url = require 'url'
request = require 'request'
Agent = require 'socks5-http-client/lib/Agent'
crypto = require 'crypto'
log = require '../lib/logger'
Util = require '../../shared/util/util.js'
icc = require '../lib/inter_component_communication'

###
# HTTP Proxy
###
@server = http.createServer (req, resp) ->
  link = req.url
  host = req.headers.host

  proxy = request {
    url: link
    encoding: 'binary'
    agentClass: Agent
    agentOptions:
      socksHost: '127.0.0.1'
      socksPort: 9052
  }, (err, res) ->
    if err
      log.error '[!] Request error: %s', err
      return
    responseChecksum = crypto.createHash('sha256').update(res.body, 'binary').digest('hex')

    resp.headers = res.headers
    resp.end res.body, 'binary'

    icc.triggerBlockchainFetching host

    log.debug ''
    log.debug 'Hostname         : %s', host
    log.debug 'MagicNo          : 0x%s', Util.doubleSha256(host).toString('hex')
    log.debug 'Requested Content: %s', link.toString()
    log.debug 'Response Checksum: 0x%s', responseChecksum.toString()
    return
  return

###*
# CONNECT requests are directlyy forwarded to the host, without interception.
# Most times that are HTTPS connections.
###

@server.on 'connect', (req, cltSocket, head) ->
  # connect to an origin server
  srvUrl = url.parse('http://' + req.url)
  srvSocket = net.connect srvUrl.port, srvUrl.hostname, ->
    cltSocket.write 'HTTP/1.1 200 Connection Established\r\n' +
      'Proxy-Agent: BlackGate-Proxy <http://blackgate.networld.to>\r\n\r\n'
    srvSocket.write head, 'binary'
    srvSocket.pipe cltSocket
    cltSocket.pipe srvSocket
    return
  return

exports.listen = ->
  @server.listen.apply @server, arguments
  return

exports.close = (callback) ->
  @server.close callback
  return
