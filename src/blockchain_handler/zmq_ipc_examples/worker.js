var zmq = require('zmq')
  , sock = zmq.socket('pull');

sock.connect(process.env.SOCKET);
console.log('Worker connected to socket %s', process.env.SOCKET);

sock.on('message', function(msg){
  console.log('[>>] nodejs worker: %s', msg.toString());
});
