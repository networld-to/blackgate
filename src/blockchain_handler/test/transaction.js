var assert = require('assert');
var Util = require('../../shared/util/util');
var Transaction = require('../lib/schema/transaction').Transaction;

describe('Transaction', function() {
  describe('serialization', function() {
    it('should serialize a valid transaction', function() {
      var trx = new Transaction({
          'parentId' : Util.doubleSha256("hello"),
          'type'     : 0x0A,
          'scriptSig': '<signature> <public_key> CHECK_SIG',
          'hostname' : '3g2upl4pq6kufc4m.onion', // duckduckgo.com search engine
          'snapshotRef' : 'magnet:?xt=urn:btih:31D6CFE0D16AE931B73C59D7E0C089C0',
          'snapshotChecksum': Util.sha256('raw content input stream'),
          'responseChecksum' : {'/': Util.sha256("<html><head>...</head><body>...</body></html>").toString('hex')}
      });
      var trx_binary = trx.serialize();
      var new_trx = Transaction.deserialize(trx_binary);
      var json = new_trx.toJSON();

      assert.equal('9595c9df90075148eb06860365df33584b75bff782a510c6cd4883a419833d50', json['ParentID']);
      assert.equal(10, json['Type']);
      assert.equal('<signature> <public_key> CHECK_SIG', json['ScriptSig']);
      assert.equal('3g2upl4pq6kufc4m.onion', json['Hostname']);
      assert.equal('magnet:?xt=urn:btih:31D6CFE0D16AE931B73C59D7E0C089C0', json['SnapshotRef']);
      assert.equal('13d4f10775ca9eafc1f9bdde2a0ee6c755198582d9803612a73ebfdccc0fee06', json['SnapshotChecksum']);
      assert.equal('{"/":"8486bb15a96b030961b39118e1c80b8b3729f749448b68540708f1d6e2254d08"}', json['ResponseChecksums']);
    });
    it('should serialize an incomplete transaction')
  });
});

