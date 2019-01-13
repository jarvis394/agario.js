/*

  1. Socket connects
  2. Socket says "start" and sends his data
  3. Server updates players list and sends back that list + POINTS ON FIELD
     Server emits "newPlayer", so other players update their players list
  4. Socket creates 'Player's
  5. Socket draws them
  6. Socket's player moves and socket sends an update
  7. Server change info about him
  8. Server does "heartbeat"
  9. Socket disconnects and server deletes his data from players list
     Server emits "removePlayer"

*/

/**
 * Returns random num between 'min' and 'max'
 * @param {number} min Minimum
 * @param {number} max Maximum
 */
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const FIELD_SIZE = 2000
const BLOB_RADIUS = 5
const BLOBS_COUNT = FIELD_SIZE / 1.25

const express = require("express");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

setInterval(() => heartbeat(), 1)
setInterval(() => {
  if (blobs.length < BLOBS_COUNT)
    blobs.push(new Blob())
    io.sockets.emit("newBlob", blobs[blobs.length - 1])
}, 1000)

function heartbeat() {
  // Send players to all sockets
  io.sockets.emit("heartbeat", players)
}

// Connected players
let players = {}
let blobs = []

class Player {
  constructor(x, y, r, b, bc, n, id) {
    this.x = x // X pos
    this.y = y // Y pos 
    this.r = r // Radius
    this.b = b // Body color
    this.bc = bc // Border color
    this.id = id // ID
    this.n = n // Nickname
  }
}

class Blob {
  constructor() {
    this.x = random(-FIELD_SIZE, FIELD_SIZE * 2) // X pos
    this.y = random(-FIELD_SIZE, FIELD_SIZE * 2) // Y pos 
    this.r = random(BLOB_RADIUS, BLOB_RADIUS * 1.3) // Radius
  }
}

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

// Create blobs on field
for (let n = 0; n < BLOBS_COUNT; n++) {
  blobs.push(new Blob())
}

io.sockets.on('connection', socket => {

  console.log("> [LOG] New client:", socket.id)

  // Socket started playing
  socket.on('start', (data) => {
    let player = new Player(data.x, data.y, data.r, data.b, data.bc, data.n, socket.id)
    players[socket.id] = player

    // Send to socket info about players to create 'Player' objects
    socket.emit('start', {
      players: players,
      blobs: blobs
    })

    // Say that to clients
    io.sockets.emit("newPlayer", player)
  });

  // Socket sends an update
  socket.on('update', (data) => {
    players[socket.id].x = data.x
    players[socket.id].y = data.y
    players[socket.id].r = data.r
  });

  // Socket disconnects
  socket.on('disconnect', (reason) => {
    // Remove player
    delete players[socket.id]

    // Say that to sockets
    io.sockets.emit("removePlayer", socket.id)

    console.log("> [LOG] Client", socket.id, "disconnected by:", reason)
  });

  // Socket eats blob
  socket.on('eatBlob', (i) => {
    blobs.splice(i, 1)
    io.sockets.emit("removeBlob", { i: i, id: socket.id })
  });

});

http.listen(4000, () => {
  console.log('> [LOG] Listening on port', 4000);
});