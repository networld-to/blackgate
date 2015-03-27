var Util = require('../util');
var hexy = require('hexy');

var Version = exports.Version = function Version (data) {
  if ("object" !== typeof data) {
    data = {};
  }
  this.version = 0xFFFFFFFF;
  this.services = 0x0;
  this.timestamp = Util.timestamp();
};

Version.prototype.getTimestamp = function() {
  return new Date(this.timestamp * 1000);
};

Version.prototype.serialize = function() {
  var blk = new Buffer(20);
  blk.fill(0);

  // Write version (4 Byte)
  blk.writeUInt32BE(this.version, 0);

  // Write 64 Bit (8 Byte) bitfield of features to be enabled for this connection
  blk.writeDoubleBE(this.services, 4);

  // Write 64 Bit (8 Byte) timestamp
  blk.writeDoubleBE(this.timestamp, 12);

  return blk;
};

/**
 * Verifies the serialized version message checksum against the checksum
 * received via the message header.
 */
Version.prototype.verify = function(checksum) {
  var computed_checksum = Util.doubleSha256(this.serialize()).slice(0, 4).toString('hex');
  if ( computed_checksum == checksum )
    return true;
  else
    return false;
};


Version.deserialize = function(rawVersion) {
  var version = new Version();
  version.version = rawVersion.readUInt32BE(0);
  version.services = rawVersion.readDoubleBE(4);
  version.timestamp = rawVersion.readDoubleBE(12);
  return version;
};
