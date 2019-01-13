/**
 * Player object
 * @class
 */
class Player {

  constructor(nick, id, color, bcolor, x, y) {
    this.radius = PLAYER_RADIUS

    if (x && y) {
      this.pos = createVector(x, y)
    } else {
      this.pos = createVector(random(w), random(h))
    }

    this.velocity = createVector(0, 0)
    this.mass = PI * this.radius * this.radius
    this.speed = 30 * Math.pow(this.mass, -0.2)
    this.points = []

    this.nick = nick
    this.id = id

    this.COLOR = color
    this.BORDER_COLOR = bcolor
  }

  makePoints() {
    this.points = []
    for (let i = 0; i < this.radius; i++) {
      let angle = map(i, 0, this.radius, 0, TWO_PI)
      let x = this.radius * cos(angle) + this.pos.x
      let y = this.radius * sin(angle) + this.pos.y

      this.points.push({
        x: x,
        y: y
      })

      this.points[i].x = constrain(this.points[i].x, -FIELD_SIZE, FIELD_SIZE * 2)
      this.points[i].y = constrain(this.points[i].y, -FIELD_SIZE, FIELD_SIZE * 2)
    }
  }

  /**
   * Draws player
   * @function
   */
  draw() {
    fill(this.COLOR)
    stroke(this.BORDER_COLOR)
    strokeWeight(4)

    beginShape()
    this.makePoints()
    this.points.forEach(p => {
      vertex(p.x, p.y)
    })
    endShape(CLOSE)

    textAlign(CENTER, CENTER)
    fill(255)
    stroke(0)
    strokeWeight(1)
    textFont(font)
    textSize(48)
    text(this.nick, this.pos.x, this.pos.y)
  }

  /**
   * Locates player to the mouse position
   * @function
   */
  move() {
    let newVelocity = createVector(mouseX - w / 2, mouseY - h / 2)

    // Update values
    this.mass = PI * this.radius * this.radius;
    this.speed = 30 * Math.pow(this.mass, -0.2);
    newVelocity.setMag(this.speed * 0.95)

    this.velocity.lerp(newVelocity, 0.1)

    this.pos.x = constrain(this.pos.x, -FIELD_SIZE, FIELD_SIZE * 2)
    this.pos.y = constrain(this.pos.y, -FIELD_SIZE, FIELD_SIZE * 2)

    this.pos.add(this.velocity)
  }

  /**
   * Returns true
   * @param {object} blob Blob object
   */
  eats(blob) {
    let d = p5.Vector.dist(this.pos, blob.pos)

    if (d < this.radius + blob.radius) {
      // A sum of 2 circles' area
      let sum = PI * this.radius * this.radius + PI * blob.radius * blob.radius * 6

      // R^2 = S / PI, then
      // R = square root of S / PI
      this.radius = sqrt(sum / PI)
      return true
    } else {
      return false
    }
  }
}