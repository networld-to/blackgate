var server = require('../lib/server');

var assert = require('assert'),
    http = require('http');

var http = require("http");

var options = {
    host: "127.0.0.1",
    port: 8080,
    path: "http://www.example.org",
    headers: {
      Host: "www.example.org"
    }
};


describe('Proxy', function () {
  before(function () {
    server.listen(8080, '127.0.0.1');
  });

  it("access to 'www.example.org' via proxy should return 200", function (done) {
    http.get(options, function(res) {
      if (res.statusCode === 200 ) done();
      else {
        throw "proxy request failed!"
      }
    });
  });

  after(function () {
    server.close();
  });
});

