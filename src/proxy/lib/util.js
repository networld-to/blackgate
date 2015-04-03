'use strict';

var crypt = require('crypto');

var sha256 = exports.sha256 = function (data) {
  return new Buffer(crypt.createHash('sha256').update(data).digest('binary'), 'binary');
};

var doubleSha256 = exports.doubleSha256 = function (data) {
  return this.sha256(this.sha256(data));
};

var timestamp = exports.timestamp = function() {
  return Math.round(+new Date()/1000);
}

