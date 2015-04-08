// producer.js
require('dotenv').load();

var zmq = require('zmq')
  , sock = zmq.socket('push');


sock.bindSync(process.env.HOSTING_NOTIFICATION);
console.log('Producer bound to socket %s', process.env.HOSTING_NOTIFICATION);

console.log('[<<] Sending work #');
sock.send(JSON.stringify({ 'snapshot' : "magnet:?xt=urn:btih:c6b609ff555a5fe5f9a2e902953907756c21386f&dn=The+Great+Book+Of+Best+Quotes+Of+All+Time.&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969",
                              'hosts': ["host1.onion" , "host2.onion"],
                              'time': 1423324,
                              'type': 'UPDATE',
                              'hostname': 'Maria'}));

/*sock.send(JSON.stringify({ 'snapshot' : "magnet..",
                            'hosts': ["host1.onion" , "host2.onion"],
                            'time': 1423324,
                            'type': 'DELETE'}));
*/
