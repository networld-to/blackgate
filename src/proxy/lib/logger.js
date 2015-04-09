'use strict';

var bunyan = require('bunyan');
var level = process.env.LOG_LEVEL || "info";
module.exports = bunyan.createLogger({
  name: "blackgate-hosting",
  level: level,
  src: false
});
