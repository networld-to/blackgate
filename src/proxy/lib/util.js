'use strict';

var crypto = require('crypto');

var sha256 = exports.sha256 = function (data) {
  return new Buffer(crypto.createHash('sha256').update(data).digest('binary'), 'binary');
};

var doubleSha256 = exports.doubleSha256 = function (data) {
  return this.sha256(this.sha256(data));
};

