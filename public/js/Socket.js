function connectToServer() {

  let nick = document.getElementById("nick").value
  let color = randomColor()

  player = new Player(nick, socket.id, color.body, color.border)

  // Say that we're connected
  socket.emit("start", {
    x: player.pos.x,
    y: player.pos.y,
    r: player.radius,
    b: player.COLOR,
    bc: player.BORDER_COLOR,
    n: player.nick
  })

  console.log(player)

  gameStarted = true
  paused = false

  document.getElementById("menu").style.display = "none"  

}

socket.on("start", (data) => {

  // Create players
  for (let id in data.players) {
    let p = data.players[id]
    players[id] = new Player(p.n, p.id, p.b, p.bc, p.x, p.y)
  }

  // Flush blobs
  blobs = []

  // Create blobs
  for (let i = 0; i < BLOBS_COUNT; i++) {
    if (data.blobs[i]) blobs.push(new Blob(data.blobs[i].x, data.blobs[i].y, data.blobs[i].r))
  }

})

socket.on("heartbeat", (list) => {

  if (!gameStarted) return

  // Update positions and radiuses
  for (let id in list) {
    players[id].pos.x = list[id].x
    players[id].pos.y = list[id].y
    players[id].radius = list[id].r
  }

})

socket.on("newPlayer", (data) => {
  // Create new player
  players[data.id] = new Player(data.n, data.id, data.b, data.bc, data.x, data.y) 
})

socket.on("removePlayer", (id) => {
  // Delete player
  delete players[id]
})

socket.on("removeBlob", (data) => {
  // Delete blob
  if (data.id !== socket.id) blobs.splice(data.i, 1)
})

socket.on("newBlob", (data) => {
  // Add blob
  blobs.push(new Blob(data.x, data.y, data.r))
})