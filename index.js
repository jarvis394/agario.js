/*

  1. Socket connects
  2. Socket says "start" and sends its data
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

const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const colors = require("colors")

const {
  BLOCKS_COUNT,
  BLOBS_COUNT
} = require("./constants")

const Blob = require("./lib/Blob")
const Block = require("./lib/Block")

setInterval(() => heartbeat(), 1)
setInterval(() => {
  if (blobs.length > BLOBS_COUNT) return
  blobs.push(new Blob())
  io.sockets.emit("newBlob", {
    blob: blobs[blobs.length - 1]
  })
}, 1000)

// Connected players
let players = {}

// Blobs
let blobs = []

// Field with blocks filled with sertain amount of blobs
let field = []

// Create blocks
for (let i = 0; i < BLOCKS_COUNT; i++) {
  field.push([])
  for (let j = 0; j < BLOCKS_COUNT; j++) {
    field[i].push(new Block(i, j))
  }
}

// Create blobs
for (let i = 0; i < BLOBS_COUNT; i++) {
  blobs.push(new Blob())
}

// Handle socket
require("./lib/socket.js")(io, players, field, blobs)



// EXPRESS //

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/views/index.html")
})

// Listen on port
http.listen(4000, () => {
  console.log('> [SERVER] Listening on port'.yellow, "4000".white);
});



// Functions

function heartbeat() {
  // Send players to all sockets
  if (players.length == 0) return

  io.sockets.emit("heartbeat", {
    players: players
  })
}