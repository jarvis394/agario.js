class UI {

  constructor() {
    this.font = loadFont('../fonts/Pencil.ttf')

    this._c = false
  }

  draw() {
    push()

    // Draw size of player
    textSize(24)
    textAlign(CENTER)
    textFont(this.font)
    fill(255)
    stroke(0)
    strokeWeight(3)
    text(floor(players[socket.id].Radius * 2), players[socket.id].pos.x, players[socket.id].pos.y - players[socket.id].Radius - 16)
    
    pop()
  }

  loading() {
    if (this._c) return
    fill(0, 0, 0, 150)
    noStroke()
    rect(0, 0, w, h)

    textFont(font)
    textSize(48)
    fill(255)
    stroke(0)
    strokeWeight(2)
    textAlign(CENTER, CENTER)
    text("Loading...", w / 2, h / 2)

    this._c = !this._c
  }

}