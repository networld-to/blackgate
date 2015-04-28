var server = require('../lib/server');
var Util = require("../../shared/util/util.js");

var assert = require('assert'),
    http = require('http'),
    zmq = require('zmq'),
    sock = zmq.socket('pull');

var options = {
    host: process.env.IP,
    port: process.env.PORT,
    path: "http://www.example.org",
    headers: {
      Host: "www.example.org"
    }
};

var count = 1;

describe('Proxy', function () {
  it("access to 'www.example.org' via proxy should return 200")

  /*
  before(function () {
    server.listen(process.env.PORT, process.env.IP);
    sock.connect(process.env.NEW_BLOCKCHAIN_SOCKET);
  });

  it("access to 'www.example.org' via proxy should return 200", function (done) {
    http.get(options, function(res) {
      sock.on('message', function(msg){
        if (res.statusCode === 200 &&
            'c87cda54e2aa4d6ba0f7d462cfa7dc74d2711733a60f1d85151c795f4521d90a' === JSON.parse(msg).magicno ) {
          done();
        }
      });
    });

  });
  */

  after(function () {
    server.close();
  });
});

