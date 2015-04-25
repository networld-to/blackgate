var Transaction = require('./lib/schema/transaction').Transaction;
var hexy = require('hexy');
var Util = require('../shared/util/util');

var trx  = new Transaction({
		'parentId' : Util.doubleSha256("hello"),
		'type' 	   : 0x12,
		'scriptSig': '<public_key> OP_VERIFY',
		'hostname' : 'umvotb4hn7o4bsfssdfsfssdt5l.onion',
		'snapshotRef' : 'magnet:?xt=urn:brnt:31D6CFE0D16AE931B73C59D7E0C089C0',
		'snapshotChecksum' : Util.sha256("my_content"),
		'responseChecksum' : {'/': Util.sha256("html_content").toString('hex')}
	});

trx_serialized = trx.serialize();
console.log(hexy.hexy(trx_serialized));

var new_trx = Transaction.deserialize(trx_serialized);
var magicNo = Util.doubleSha256("original-host.onion").toString('hex');
new_trx.save(magicNo);

console.log(new_trx.toJSON());
console.log(Util.doubleSha256("hello").toString('hex').length);
