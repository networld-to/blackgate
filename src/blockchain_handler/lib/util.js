var crypto = require('crypto');
var Enum = require('enum');

var PACKAGE_HEADER_LENGTH = exports.PACKAGE_HEADER_LENGTH = 41;
var TIMEOUT = exports.TIMEOUT = 3000; // Connection Timeout in Milliseconds

var COMMANDS = exports.COMMANDS = new Enum({
  'VERSION'       : 0x00,
  'VERSION_ACK'   : 0x01,
  'BLOCK_REQUEST' : 0x02,
  'BLOCK'         : 0x03,
  'TRX'           : 0x04,
  'CONFIRM_TRX'   : 0x08
});


var sha256 = exports.sha256 = function (data) {
    return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var doubleSha256 = exports.doubleSha256 = function (data) {
    return this.sha256(this.sha256(data));
};


var timestamp = exports.timestamp = function() {
  return Math.round(+new Date()/1000);
}
