var transaction = require('./lib/schema/transaction');
var hexy = require('hexy');
var Util = require('../shared/util/util');

var trx  = new transaction.Transaction({
		'parentId' : Util.doubleSha256("hello"),
		'type' 	   : 0x12,
		'scriptSig': 'Hi stavros',
		'hostname' : 'umvotb4hn7o4bsfssdfsfssdt5l.onion',
		'snapshotRef' : 'magnet:?xt=urn:ed2k:31D6CFE0D16AE931B73C59D7E0C089C0',
		'snapshotChecksum' : Util.sha256("my_content"),
		'responseChecksum' : {'/': Util.sha256("html_content").toString('hex')}
	});

trx_serialized = trx.serialize();
console.log(hexy.hexy(trx_serialized));

console.log(transaction.Transaction.deserialize(trx_serialized).toJSON());
console.log(Util.doubleSha256("hello").toString('hex').length);
