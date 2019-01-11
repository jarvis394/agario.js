let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

const PLAYER_RADIUS = 32

BLOB_RADIUS = 5,
  BLOBS_COUNT = w / 1.25,

  FIELD_SIZE = 2000,
  GRID_SIZE = 40

let player
let ui
let grid
let blobs = []
let players = []
let paused = false
let fillCounter = 0

let zoom = 1

// Create socket and connect
let socket = io()

function setup() {
  // Create canvas (obvious)
  createCanvas(w, h)

  // Create blobs
  for (let n = 0; n < BLOBS_COUNT; n++) {
    blobs.push(new Blob())
  }

  // Create player
  player = new Player()

  // Say that we're connected
  socket.emit("start", {
    x: player.pos.x,
    y: player.pos.y,
    r: player.radius,
    body_color: player.COLOR,
    border_color: player.BORDER_COLOR
  })

  // Make shape of player's circle
  player.makePoints()

  // Create UI overlay
  ui = new UI()

  // Create grid
  grid = new Grid(GRID_SIZE)
}

function draw() {
  if (paused && fillCounter == 0) {
    noStroke()
    fill(0, 0, 0, 100)
    fillCounter++
    return rect(0, 0, w, h)
  } else if (paused) return
  else fillCounter = 0

  // Clear previous canvas
  clear()

  // Move view to the center
  translate(w / 2, h / 2)

  let newZoom = w / (player.radius * 25)
  if (newZoom < 0.7) newZoom = 0.7
  zoom = lerp(zoom, newZoom, 0.1)

  scale(zoom)
  translate(-player.pos.x, -player.pos.y)

  // Draw grid
  grid.draw()

  // Draw blobs
  for (let i = blobs.length - 1; i >= 0; i--) {
    if (blobs[i]) blobs[i].draw()

    if (player.eats(blobs[i])) {
      blobs.splice(i, 1)
    }
  }

  // Draw field's borders
  stroke(70)
  noFill()
  rect(-FIELD_SIZE, -FIELD_SIZE, FIELD_SIZE * 3, FIELD_SIZE * 3)

  // Draw player (crossline) PLAYERS
  player.draw()

  players.forEach(player => {
    if (socket.id !== player.id) {
      fill(player.body_color)
      stroke(player.border_color)
      strokeWeight(4)
      ellipse(player.x, player.y, player.r * 2)
    }
    
    textAlign(CENTER)
    textSize(12)
    fill(0)
    noStroke()
    text(player.id, player.x, player.y - player.r * 2 + 8)
  })

  // Draw UI overlay
  ui.draw()

  // And then move player (FIXED: text goes on previous position of player)
  player.move()
}

function windowResized() {
  w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (keyCode === 27) paused = !paused
}

socket.on("heartbeat", (blobs) => {
  // Update our location
  socket.emit("update", {
    x: player.pos.x,
    y: player.pos.y,
    r: player.radius
  })
  
  players = blobs
})

setInterval(() => {
  if (blobs.length < BLOBS_COUNT)
    blobs.push(new Blob())
}, 100)

setInterval(() => {
  blobs.push(new Blob())
}, 1500)

/**
 * Create random bright contrast color for player
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