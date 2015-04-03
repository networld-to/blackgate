var bunyan = require('bunyan');
module.exports = bunyan.createLogger({
  name: "blackgate-proxy",
  level: "trace",
  src: false
});
