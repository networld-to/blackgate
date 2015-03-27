/*******************************************************************
 * TODO: This is code snippet is only used for testing purposes. The
 * functionality implemented here will be merge with `bin/node`
 ******************************************************************/
var net = require('net');
var colors = require('colors');
var hexy = require('hexy');

var Util = require('./lib/util.js');
var CommandPackage = require('./lib/parser/command_package.js').CommandPackage;
var Block = require('./lib/schema/block.js').Block;
var Version = require('./lib/schema/version.js').Version;

function sendBlockRequest() {
  var timestamp = Util.timestamp();

  // Create a first command
  var magicNo = Util.doubleSha256('hello'); // The blockchain identifier aka. magic number

  var checksum = Util.doubleSha256('').slice(0, 4);

  var command = new Buffer(1);
  command.writeUInt8(Util.COMMANDS.get('BLOCK_REQUEST').value);

  var payloadSize = new Buffer(4);
  payloadSize.writeUInt32BE(0);

  // What should be the checksum if there is no payload?
  var checksum = Util.doubleSha256('').slice(0, 4);

  return Buffer.concat([magicNo, command, payloadSize, checksum ]);
}

function sendVersion() {
  var payload = new Version().serialize();

  var magicNo = Util.doubleSha256('hello'); // The blockchain identifier aka. magic number

  var command = new Buffer(1);
  command.writeUInt8(Util.COMMANDS.get('VERSION').value);

  var payloadSize = new Buffer(4);
  payloadSize.writeUInt32BE(payload.length);

  var checksum = Util.doubleSha256(payload).slice(0, 4);

  return Buffer.concat([magicNo, command, payloadSize, checksum, payload ]);
}

var client = net.connect(8123, '127.0.0.1', function() {
  console.log("< Sending 'VERSION' message...".green);
  client.write(sendVersion());

  client.setTimeout(Util.TIMEOUT, function() {
    var node = client.address();
    console.log("No response received from the node '".yellow + node.address.yellow + ':'.yellow + node.port.toString().yellow  + "'".yellow);
    client.end();
  });

  client.on('data', function(data) {
    var command = Util.COMMANDS.get(data.readUInt8(32)).key; // 32 Byte MagicNo offset

   console.log("> Received '".green + command.green + "' message.".green);
    switch(command) {
      case 'VERSION_ACK':
        console.log("< Sending 'BLOCK_REQUEST'...".green);
        client.end(sendBlockRequest());
        break;
      case 'BLOCK':
        client.end();
        // TODO: Validate and store the received block.
        var pkg = new CommandPackage(data);
        console.log("MagicNo     : ".yellow + pkg.getMagicNo());
        console.log("Command     : ".yellow + pkg.getCommandString() + " (" + pkg.getCommand() + ")");
        console.log("Payload Size: ".yellow + pkg.getPayloadSize() + " Bytes");
        console.log("Checksum    : ".yellow + pkg.getChecksum());

        var payload = pkg.getPayload();
        console.log("BLOCK Payload".yellow);
        console.log("|-> Version : ".yellow + "0x" + payload.version.toString(16));
        console.log("|-> Time    : ".yellow + payload.getTimestamp());

        break;
    }
  });
});

