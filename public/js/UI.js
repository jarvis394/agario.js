class UI {

  constructor() {
    this.font = loadFont('../fonts/Pencil.ttf')
  }

  draw() {
    push()
    textSize(24)
    textAlign(CENTER)
    textFont(this.font)
    fill(255)
    stroke(0)
    strokeWeight(3)
    text(floor(player.radius * 2), player.pos.x, player.pos.y - player.radius - 8)
    pop()
  }

}