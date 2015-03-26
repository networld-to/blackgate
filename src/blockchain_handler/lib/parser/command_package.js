var hexy = require('hexy');
var Util = require('../util.js');
var Block = require('../schema/block.js').Block;

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
  }
};

CommandPackage.prototype.toString = function() {
  return hexy.hexy(this.data);
};

