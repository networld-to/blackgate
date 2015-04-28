var Util = require('../../../shared/util/util.js');

var Block = exports.Block = function Block (data) {
  if ("object" !== typeof data) {
    data = {};
  }
  this.hash = data.hash || 0;
  this.version = data.version || 0;
  this.timestamp = data.timestamp || 0;
  this.txs = data.txs || [];
};

Block.prototype.getHeader = function() {
  var header = new Buffer(16);
  header.fill(0);
  // Write version
  header.writeUInt32BE(this.version);

  return header;
};

Block.prototype.getTimestamp = function() {
  return new Date(this.timestamp * 1000);
};

Block.prototype.calcHash = function() {
  var header = this.getHeader();
  return Util.doubleSha256(header);
};

Block.prototype.serialize = function() {
  var blk = new Buffer(12);
  blk.fill(0);
  // Write version
  blk.writeUInt32BE(this.version, 0);

  // Write 64 Bit (8 Byte) timestamp
  blk.writeDoubleBE(this.timestamp, 4);
  return blk;
};

Block.deserialize = function(rawBlock) {
  var blk = new Block();
  blk.version = rawBlock.readUInt32BE(0);
  blk.timestamp = rawBlock.readDoubleBE(4);
  return blk;
};
