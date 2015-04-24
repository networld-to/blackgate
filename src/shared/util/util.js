var crypto = require('crypto');
var Enum = require('enum');

var PACKAGE_HEADER_LENGTH = exports.PACKAGE_HEADER_LENGTH = 41;
var TIMEOUT = exports.TIMEOUT = 6000; // Connection Timeout in Milliseconds

var COMMANDS = exports.COMMANDS = new Enum({
  'VERSION'       : 0x00,
  'VERSION_ACK'   : 0x01,
  'BLOCK_REQUEST' : 0x02,
  'BLOCK'         : 0x03,
  'TRX'           : 0x04,
  'CONFIRM_TRX'   : 0x08
});

var TRX_FIELDS_SIZE = exports.TRX_FIELDS_SIZE = {
	'TransactionID'      	: 32,
	'ParentID'           	: 32,
	'Type'					: 1,
	'ScriptSigLength'    	: 4,
	'HostnameLength'     	: 4,
	'SnapshotRefLength'     : 4,
	'SnapshotChecksum'      : 32,
	'ResponseChecksumLength': 4
};

var BLOCK_FIELDS_SIZE = exports.BLOCK_FIELDS_SIZE = {
	'SignatureLength'       : 4,
	'BlockHeader'			: 76
};

var BLOCKHEADER_FIELDS_SIZE = exports.BLOCKHEADER_FIELDS_SIZE = {
	'Version'      			: 4,
	'HashPrevBlock'       	: 32,
	'HashMerkelRoot'		: 32,
	'Time'					: 8
};

var sha256 = exports.sha256 = function (data) {
    return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var doubleSha256 = exports.doubleSha256 = function (data) {
    return this.sha256(this.sha256(data));
};


var timestamp = exports.timestamp = function() {
  return Math.round(+new Date()/1000);
}

