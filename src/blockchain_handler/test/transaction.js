var assert = require('assert');
var Util = require('../lib/util');
var Transaction = require('../lib/schema/transaction').Transaction;

describe('Transaction', function() {
  describe('#serialize', function() {
    it('should serialize a valid transaction', function() {
      var trx = new Transaction({
          'parentId' : Util.doubleSha256("hello"),
          'type'     : 0x0A,
          'scriptSig': '<signature> <public_key> CHECK_SIG',
          'hostname' : '3g2upl4pq6kufc4m.onion', // duckduckgo.com search engine
          'snapshotChecksum': Util.sha256('raw content input stream'),
          'responseChecksum' : {'/': Util.sha256("<html><head>...</head><body>...</body></html>").toString('hex')}
      });
      var trx_binary = trx.serialize();
      console.log(trx_binary.toString('hex'));
    });
  });
});

