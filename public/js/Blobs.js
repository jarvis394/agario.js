/**
 * Blob object
 * @class
 */
class Blob {

  constructor(x, y, r) {
    if (x && y && r) {
      this.pos = createVector(x, y)
      this.radius = floor(r)
      this.color = randomColor().body
    } else {
      this.pos = createVector(random(-FIELD_SIZE, FIELD_SIZE * 2), random(-FIELD_SIZE, FIELD_SIZE * 2))
      this.radius = floor(random(BLOB_RADIUS, BLOB_RADIUS * 1.3))
      this.color = randomColor().body
    }
  }

  /**
   * Draws blob
   * @function
   */
  draw() {
    fill(this.color)
    noStroke()

    ellipse(this.pos.x, this.pos.y, this.radius * 2)
  }

}