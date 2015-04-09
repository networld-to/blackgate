var hexy = require('hexy');
var Util = require('../../../shared/util/util.js');
var Block = require('../schema/block.js').Block;
var Version = require('../schema/version.js').Version;

var CommandPackage = exports.CommandPackage = function CommandPackage(rawData) {
  if ("object" !== typeof rawData || rawData.length < Util.PACKAGE_HEADER_LENGTH ) {
    throw new Error('Received raw package not valid.');
  }
  this.data = rawData;
};

CommandPackage.prototype.getMagicNo = function() {
  return this.data.toString('hex', 0, 32);
};

CommandPackage.prototype.getCommand = function() {
  return this.data.readUInt8(32);
};

CommandPackage.prototype.getCommandString = function() {
  return Util.COMMANDS.get(this.getCommand()).key;
};

CommandPackage.prototype.getPayloadSize = function() {
  return this.data.readUInt32BE(33);
};

CommandPackage.prototype.getChecksum = function() {
  return this.data.toString('hex', 37, Util.PACKAGE_HEADER_LENGTH);
};

CommandPackage.prototype.getPayload = function() {
  var startPayload = Util.PACKAGE_HEADER_LENGTH;
  var payloadSize = this.getPayloadSize();
  var payload = this.data.slice(startPayload, startPayload + payloadSize);

  if ( this.getCommandString() == 'BLOCK' ) {
    return Block.deserialize(payload);
  } else if ( this.getCommandString() == 'VERSION' ) {
    return Version.deserialize(payload);
  }
};

CommandPackage.prototype.toString = function() {
  return hexy.hexy(this.data);
};

/*
 * Creates a version package for the doubleSha256(hostname) blockchain.
 */
CommandPackage.getVersionPackage = function(hostname) {
  var magicNo = Util.doubleSha256(hostname);
  var payload = new Version().serialize();

  var command = new Buffer(1);
  command.writeUInt8(Util.COMMANDS.get('VERSION').value);

  var payloadSize = new Buffer(4);
  payloadSize.writeUInt32BE(payload.length);

  var checksum = Util.doubleSha256(payload).slice(0, 4);

  return Buffer.concat([magicNo, command, payloadSize, checksum, payload ]);
}

