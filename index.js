const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

setInterval(() => heartbeat(), 10)

function heartbeat() {
  io.sockets.emit("heartbeat", blobs)
}

let blobs = []

class Blob {
  constructor(x, y, r, b, bc, id) {
    this.x = x
    this.y = y
    this.r = r
    this.body_color = b
    this.border_color = bc
    this.id = id
  }
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

io.sockets.on('connection', socket => {

  console.log("New client:", socket.id)

  // Emit new connection
  socket.emit('new_connection');

  socket.on('start', (data) => {
    let blob = new Blob(data.x, data.y, data.r, data.body_color, data.border_color, socket.id)
    blobs.push(blob)
  });

  socket.on('update', (data) => {
    for (let i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blobs[i].x = data.x
        blobs[i].y = data.y
        blobs[i].r = data.r
      }
    }
  });

  socket.on('disconnect', (reason) => {
    // Emit disconnect
    io.emit('disconnect');

    for (let i = 0; i < blobs.length; i++) {
      if (socket.id == blobs[i].id) {
        blobs.splice(i, 1)
      }
    }

    console.log("Client", socket.id, "disconnected by:", reason)
  });

});

http.listen(4000, () => {
  console.log('> [LOG] Listening on port', 400);
});