const http = require('http');
const WebSocket = require('ws');
const url = require('url');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('OK');
});

const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  const pathname = url.parse(req.url).pathname;

  if (pathname === '/ws') {
    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

const clients = {};

wss.on('connection', ws => {
  ws.on('message', msg => {
    let data;
    try {
      data = JSON.parse(msg);
    } catch (e) {
      return;
    }

    const { to, from, type, payload } = data;
    clients[from] = ws;

    if (to && clients[to]) {
      clients[to].send(JSON.stringify({ from, type, payload }));
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`WebRTC signaling server running on port ${port}`);
});