let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

const PLAYER_RADIUS = 32
const FIELD_SIZE = 2000
const GRID_SIZE = 40

const BLOB_RADIUS = 5
const BLOBS_COUNT = FIELD_SIZE / 1.25

let players = {}
let player
let ui
let grid
let blobs = []
let paused = true
let gameStarted = false
let fillCounter = 0

let zoom = 1

let font

// Create socket and conect
let socket = io()

function setup() {
  // Create canvas (obvious)
  createCanvas(w, h)

  // Create blobs
  for (let n = 0; n < BLOBS_COUNT; n++) {
    blobs.push(new Blob())

    // Whem user is not connected, then draw a field's blobs
    blobs[n].draw()
  }

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
  if (paused && fillCounter == 0) {
    noStroke()
    fill(0, 0, 0, 150)
    fillCounter++
    return rect(0, 0, w, h)
  } else if (paused) return
  else fillCounter = 0

  if (!players[socket.id]) return ui.loading()

  // Clear previous canvas
  clear()

  // Move view to the center
  translate(w / 2, h / 2)

  let newZoom = w / (players[socket.id].radius * 25)
  if (newZoom < 0.7) newZoom = 0.7
  zoom = lerp(zoom, newZoom, 0.1)

  scale(zoom)
  translate(-players[socket.id].pos.x, -players[socket.id].pos.y)

  // Draw grid
  grid.draw()

  // Draw blobs
  for (let i = blobs.length - 1; i >= 0; i--) {
    if (blobs[i]) blobs[i].draw()

    if (players[socket.id].eats(blobs[i])) {
      blobs.splice(i, 1)
      socket.emit("eatBlob", i)
    }
  }

  // Draw field's borders
  stroke(70)
  noFill()
  rect(-FIELD_SIZE, -FIELD_SIZE, FIELD_SIZE * 3, FIELD_SIZE * 3)

  // Draw UI overlay
  ui.draw()

  // Draw players
  for (let id in players) {
    // Draw player
    players[id].draw()

    // Oh... that's me?
    if (id === socket.id) {
      // Move yourself
      players[id].move()

      // Update our location
      socket.emit("update", {
        x: players[id].pos.x,
        y: players[id].pos.y,
        r: players[id].radius
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

// setInterval(() => {
//   if (blobs.length < BLOBS_COUNT)
//     blobs.push(new Blob())
// }, 100)

// setInterval(() => {
//   blobs.push(new Blob())
// }, 1500)

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