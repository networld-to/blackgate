var assert = require("assert");
var Util = require("../../shared/util/util.js");

describe('Util', function() {
  describe('#doubleSha256', function() {
    it("should return the right sha256 double hash for the 'hello' string", function() {
      assert.equal('9595c9df90075148eb06860365df33584b75bff782a510c6cd4883a419833d50', Util.doubleSha256('hello').toString('hex'));
    });

    it("should return the right sha256 double hash for the 'example.onion' string", function() {
      assert.equal('499ec17c7c58476ae73eacf8854d99e80e80c765829025a693e1e1a45b578cc8', Util.doubleSha256('example.onion').toString('hex'));
    });

    it("should return the right sha256 double hash for the empty string", function() {
      assert.equal('5df6e0e2761359d30a8275058e299fcc0381534545f55cf43e41983f5d4c9456', Util.doubleSha256('').toString('hex'));
    });
  });


  describe('#sha256', function() {
    it("should return the right sha256 hash for the 'hello' string", function() {
      assert.equal('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824', Util.sha256('hello').toString('hex'));
    });

    it("should return the right sha256 hash for the 'example.onion' string", function() {
      assert.equal('02f1fdaeb7eb1af08d62805a4d44db51d3f0e6944987da90e55a64fb77e36daf', Util.sha256('example.onion').toString('hex'));
    });

    it("should return the right sha256 hash for the empty string", function() {
      assert.equal('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', Util.sha256('').toString('hex'));
    });
  });
});
