var crypto = require('crypto');
var Enum = require('enum');

var PACKAGE_HEADER_LENGTH = exports.PACKAGE_HEADER_LENGTH = 41;

var COMMANDS = exports.COMMANDS = new Enum({
  'GET_BLOCK'   : 0x01,
  'BLOCK'       : 0x02,
  'TRX'         : 0x04,
  'CONFIRM_TRX' : 0x08
});


var sha256 = exports.sha256 = function (data) {
    return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var timestamp = exports.timestamp = function() {
  return Math.round(+new Date()/1000);
}
