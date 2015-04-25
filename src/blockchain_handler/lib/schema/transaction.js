var Util = require('../../../shared/util/util.js');
var PersistentTransaction = require('../persistent').Transaction;

var Transaction = exports.Transaction = function Transaction(data){

  if ("object" !== typeof data) {
    data = {};
  }
  this.transactionId = data.transactionId || '';
  this.parentId = data.parentId || ''; // XXX: Default value breaks serialization.
  this.type = data.type || 0;
  this.scriptSig = data.scriptSig || '';
  this.hostname = data.hostname || '';
  this.snapshotRef = data.snapshotRef || '';
  this.snapshotChecksum = data.snapshotChecksum || ''; // XXX: Default value breaks serialization.
  this.responseChecksum = JSON.stringify(data.responseChecksum || {});
}

Transaction.prototype.serialize = function() {
  var typeBuf = new Buffer(Util.TRX_FIELDS_SIZE['Type']);
  typeBuf.fill(0);
  typeBuf.writeUInt8(this.type);

  var scriptSigLengthBuf = new Buffer(Util.TRX_FIELDS_SIZE['ScriptSigLength']);
  scriptSigLengthBuf.fill(0);
  scriptSigLengthBuf.writeUInt32BE(this.scriptSig.length);

  var scriptSigBuf = new Buffer(this.scriptSig.toString());

  var hostnameLengthBuf = new Buffer(Util.TRX_FIELDS_SIZE['HostnameLength']);
  hostnameLengthBuf.fill(0);
  hostnameLengthBuf.writeUInt32BE(this.hostname.length);

  var hostnameBuf = new Buffer(this.hostname.toString());

  var snapshotRefLengthBuf = new Buffer(Util.TRX_FIELDS_SIZE['SnapshotRefLength']);
  snapshotRefLengthBuf.fill(0);
  snapshotRefLengthBuf.writeUInt32BE(this.snapshotRef.length);

  var snapshotRefBuf = new Buffer(this.snapshotRef.toString());

  var responseChecksumLengthBuf = new Buffer(Util.TRX_FIELDS_SIZE['ResponseChecksumLength']);
  responseChecksumLengthBuf.fill(0);
  responseChecksumLengthBuf.writeUInt32BE(this.responseChecksum.length);

  var responseChecksumBuf = new Buffer(this.responseChecksum.toString());

  var trx = Buffer.concat([this.parentId,
      typeBuf,
      scriptSigLengthBuf,
      scriptSigBuf,
      hostnameLengthBuf,
      hostnameBuf,
      snapshotRefLengthBuf,
      snapshotRefBuf,
      this.snapshotChecksum,
      responseChecksumLengthBuf,
      responseChecksumBuf	]);

  var transactionId = Util.doubleSha256(trx.toString('hex'));
  return Buffer.concat([transactionId, trx]);
}

Transaction.deserialize = function(rawTransaction){
  var scriptSigStart, hostnameStart, snapshotRefStart, snapshotChecksumStart, responseChecksumStart;

  var trx = new Transaction();
  trx.transactionId = rawTransaction.slice(0, 32);
  trx.parentId = rawTransaction.slice(32, 64);
  trx.type = rawTransaction.readUInt8(64);
  var scriptSigLength = rawTransaction.readUInt32BE(65);
  var hostnameStart = 69 + scriptSigLength;
  trx.scriptSig =rawTransaction.slice(69,hostnameStart).toString('ascii');
  var hostnameLength = rawTransaction.readUInt32BE(hostnameStart);
  snapshotRefStart = hostnameStart + 4 + hostnameLength;
  trx.hostname = rawTransaction.slice(hostnameStart + 4,snapshotRefStart).toString('ascii');
  var snapshotRefLength = rawTransaction.readUInt32BE(snapshotRefStart);
  snapshotChecksumStart = snapshotRefStart + 4 + snapshotRefLength;
  trx.snapshotRef = rawTransaction.slice(snapshotRefStart + 4,snapshotChecksumStart).toString('ascii');
  responseChecksumStart = snapshotChecksumStart + 32;
  trx.snapshotChecksum = rawTransaction.slice(snapshotChecksumStart,responseChecksumStart);
  var responseChecksumLength =  rawTransaction.readUInt32BE(responseChecksumStart);
  trx.responseChecksum = rawTransaction.slice(responseChecksumStart + 4, responseChecksumStart + 4 + responseChecksumLength).toString('ascii');

  return trx;
}

Transaction.prototype.toJSON = function(){
  return {
    'TransactionID' : this.transactionId.toString('hex'),
    'ParentID': this.parentId.toString('hex'),
    'Type': this.type,
    'ScriptSig': this.scriptSig,
    'Hostname': this.hostname,
    'SnapshotRef': this.snapshotRef,
    'SnapshotChecksum' : this.snapshotChecksum.toString('hex'),
    'ResponseChecksums' : this.responseChecksum
  };
}

Transaction.prototype.save = function(magicNo) {
  PersistentTransaction.create({
    magicNo: magicNo,
    transactionId: this.transactionId.toString('hex'),
    parentId: this.parentId.toString('hex'),
    type: this.type,
    scriptSig: this.scriptSig,
    hostname: this.hostname,
    snapshotRef: this.snapshotRef,
    snapshotChecksum: this.snapshotChecksum.toString('hex'),
    responseChecksums: this.responseChecksum
  })
}
