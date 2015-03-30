// producer.js
var zmq = require('zmq')
  , sock = zmq.socket('push');

var count = 0;

sock.bindSync(process.env.SOCKET);
console.log('Producer bound to socket %s', process.env.SOCKET);

setInterval(function(){
  console.log('[<<] Sending work #' + count);
  sock.send(JSON.stringify({ 'job' : count }));
  count++;
}, 500);
