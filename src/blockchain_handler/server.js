var net = require('net');
var colors = require('colors');

var Util = require('./lib/util.js');
var Block = require('./lib/schema/block.js').Block;

/**
 * Move that to separate module
 */

var ip = '127.0.0.1';
var port = 1337;

var server = net.createServer(function (socket) {

  console.log("[C] ".green + "Client connected...".green);

  var timestamp = Util.timestamp();
  var blk = new Block({ version: 0xabcdef27, timestamp: timestamp });

  // A hash value of the hostname of the creator, from the genesis block.
  // (sha256 of first hostname)

  var payload = blk.serialize();

  // Create a first command
  var magicNo = Util.sha256('');
  socket.write(magicNo);

  var command = new Buffer(1);
  command.writeUInt8(Util.COMMANDS.get('BLOCK').value);
  socket.write(command);

  var payloadSize = new Buffer(4);
  payloadSize.writeUInt32BE(payload.length);
  socket.write(payloadSize);

  var checksum = blk.calcHash().slice(0, 4);
  socket.write(checksum);

  socket.end(payload);
});

process.on("uncaughtException", function(err) {
    console.log("[!] ".red + err.toString().red);
});

server.listen(port, ip);

console.log("[*] Starting blockchain handler on ".green +
    ip.blue + ":".blue + port.toString().blue);

