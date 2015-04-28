/*******************************************************************
 * TODO: This is code snippet is only used for testing purposes. The
 * functionality implemented here will be merge with `bin/node`
 ******************************************************************/
require('colors');
var hexy = require('hexy');

var Util = require('../shared/util/util.js');
var CommandPackage = require('./lib/parser/command_package.js').CommandPackage;
var Version = require('./lib/schema/version.js').Version;

function sendBlockRequest() {
  // Create a first command
  var magicNo = Util.doubleSha256('hello'); // The blockchain identifier aka. magic number

  var checksum = Util.doubleSha256('').slice(0, 4);

  var command = new Buffer(1);
  command.writeUInt8(Util.COMMANDS.get('BLOCK_REQUEST').value);

  var payloadSize = new Buffer(4);
  payloadSize.writeUInt32BE(0);

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

var Socks = require('socks');

var options = {
  proxy: {
    ipaddress: "127.0.0.1",
    port: 9051,
    type: 5  // (4 or 5)
  },

  target: {
    host: "zgda6aqhgye572dw.onion",
    port: 8123
  }
};

Socks.createConnection(options, function (err, socket, info) {
  if (err) {
    console.log(err);
    console.log(info);
  } else {
    // Please remember that sockets need to be resumed before any data will come in.
    socket.resume();

    console.log("Connected");

    // We can do whatever we want with the socket now.
    console.log("< Sending 'VERSION' message...".green);
    socket.write(sendVersion());

    socket.setTimeout(Util.TIMEOUT, function() {
      console.log("No response received from node");
      socket.end();
    });

    socket.on('data', function(data) {
      console.log(hexy.hexy(data));
      var command = Util.COMMANDS.get(data.readUInt8(32)).key; // 32 Byte MagicNo offset

      console.log("> Received '".green + command.green + "' message.".green);
      switch(command) {
        case 'VERSION_ACK':
          console.log("< Sending 'BLOCK_REQUEST'...".green);
          socket.end(sendBlockRequest());
          break;
        case 'BLOCK':
          socket.end();
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

  }
});
