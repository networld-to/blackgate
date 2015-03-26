var net = require('net');
var colors = require('colors');
var hexy = require('hexy');
var Block = require('./lib/schema/block.js').Block;
var CommandPackage = require('./lib/parser/command_package.js').CommandPackage;

var format = {};
format.caps = 'upper';

var client = net.connect(1337, '127.0.0.1', function() {
  console.log('[*] Connected to server!'.green);
  client.end('');
});

client.on('data', function(data) {
  var pkg = new CommandPackage(data);
  console.log('--- BEGIN Raw Data ---'.red);
  console.log(pkg.toString());
  console.log('--- END Raw Data   ---\r\n'.red);

  console.log("MagicNo     : ".yellow + pkg.getMagicNo());
  console.log("Command     : ".yellow + pkg.getCommandString() + " (" + pkg.getCommand() + ")");
  console.log("Payload Size: ".yellow + pkg.getPayloadSize() + " Bytes");
  console.log("Checksum    : ".yellow + pkg.getChecksum());

  var payload = pkg.getPayload();
  console.log("Payload".yellow);
  console.log("|-> Version : ".yellow + "0x" + payload.version.toString(16));
  console.log("|-> Time    : ".yellow + payload.getTimestamp());

  client.destroy();
});

client.on('end', function() {
  console.log('[*] Disconnected from server'.green);
});

