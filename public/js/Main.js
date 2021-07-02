let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

const PLAYER_RADIUS = 16
const FIELD_SIZE = 10000
const GRID_SIZE = 40

const BLOCKS_COUNT = Math.ceil(FIELD_SIZE / 10)
const BLOCKS_SIZE = FIELD_SIZE / BLOCKS_COUNT

const BLOBS_COUNT = FIELD_SIZE / 1.25
const BLOB_RADIUS = 5

let players = {}
let ui
let grid
let blobs = []
let allBlobs = []
let paused = true
let gameStarted = false
let c = 0

let zoom = 1

let font

// Create socket and conect
let socket = io()

function setup() {
  // Create canvas (obvious)
  createCanvas(w, h)

  // Create UI overlay
  ui = new UI()

  // Create grid
  grid = new Grid(GRID_SIZE)

  // Whem user is not connected, then draw a field's grid
  grid.draw()

  // Load font
  font = loadFont("../fonts/Pencil.ttf")
}

function draw() {
  if (!gameStarted) {
    clear()
    
    grid.draw()
    
    for (let n = 0; n < BLOBS_COUNT; n++) {
      if (blobs[n]) blobs[n].draw()
    }
    
    for (let id in players) {
      players[id].draw()
    }
    
    fill(0, 0, 0, 120)
    noStroke()
    rect(0, 0, w, h)
    
    return
  }

  if (!players[socket.id]) return ui.loading()
  
  // Clear previous canvas
  clear()

  // Move view to the center
  translate(w / 2, h / 2)

  let newZoom = sqrt(h / (players[socket.id].radius * 8))
  if (newZoom < 0.7) newZoom = 0.7
  zoom = lerp(zoom, newZoom, 0.1)
  
  scale(zoom)
  translate(-players[socket.id].pos.x, -players[socket.id].pos.y)

  // Draw grid
  grid.draw()
  
  // Draw blobs
  for (let i = blobs.length - 1; i >= 0; i--) {
    if (!blobs[i] || (
      blobs[i].pos.x < players[socket.id].pos.x - windowWidth / 2 - (windowWidth / 2) * map(zoom, 0.7, 2, 2, 0.7) ||
      blobs[i].pos.x > players[socket.id].pos.x + windowWidth / 2 + (windowWidth / 2) * map(zoom, 0.7, 2, 2, 0.7) ||
      blobs[i].pos.y < players[socket.id].pos.y - windowHeight / 2 - (windowHeight / 2) * map(zoom, 0.7, 2, 2, 0.7) ||
      blobs[i].pos.y > players[socket.id].pos.y + windowHeight / 2 + (windowHeight / 2) * map(zoom, 0.7, 2, 2, 0.7) 
      )
    ) continue
    
    blobs[i].draw()

    if (players[socket.id].eats(blobs[i])) {
      socket.emit("eatBlob", i)
      blobs.splice(i, 1)
    }
  }

  // Draw field's borders
  stroke(100, 100, 150, 10)
  strokeWeight(8)
  noFill()
  rect(0, 0, FIELD_SIZE, FIELD_SIZE)

  // Draw UI overlay
  ui.draw()

  // Draw players
  for (let id in players) {
    // Draw player
    players[id].draw()
    
    // Check collision
    if (id !== socket.id && players[socket.id].eats(players[id]) && players[id]) {
      delete players[id]
      socket.emit("removePlayer", id)
    }

    // Oh... that's me?
    if (id === socket.id && !paused && players[socket.id]) {
      // Move yourself
      players[socket.id].move()

      // Update our location
      socket.emit("update", {
        x: players[socket.id].pos.x,
        y: players[socket.id].pos.y,
        r: players[socket.id].radius
      })
    }
  }
}

function windowResized() {
  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

  resizeCanvas(windowWidth, windowHeight)
}

function keyPressed() {
  if (gameStarted && keyCode === 27) paused = !paused
}


/**
 * Create random bright contrast color
 * @function
 */
const randomColor = () => {
  let color = floor(random(360))
  let body = `hsla(${color}, 100%, 50%, 1)`
  let border = `hsla(${color}, 100%, 35%, 1)`

  return {
    body: body,
    border: border
  }
}