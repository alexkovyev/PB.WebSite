const tls = require('tls');
const fs = require('fs');

const options = {
    ca: [fs.readFileSync(__dirname + '/server.crt')],
    key: fs.readFileSync(__dirname + '/client.key'),
    cert: fs.readFileSync(__dirname + '/client.crt'),

    checkServerIdentity: () => { return null; },
}

var socket = tls.connect(53209, '10.0.1.21', options, () => {
    console.log('client connected',
                socket.authorized ? 'authorized' : 'unauthorized');
    process.stdin.pipe(socket);
    process.stdin.resume();
  });
  socket.setEncoding('utf8');
  socket.on('data', (data) => {
    console.log(data);
  });

  socket.on('end', () => {
    console.log('Ended')
  });

function sendRequest(jsonString) {

}

module.exports = {
    sendRequest,
}