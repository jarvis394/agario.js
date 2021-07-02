/**
 * Blob object
 * @class
 */
class Blob {

  constructor(x, y, r, c, id) {
    if (x && y) {
      this.pos = createVector(x, y)
      this.radius = floor(r)
      this.color = c
    } else {
      this.pos = createVector(random(0, FIELD_SIZE), random(0, FIELD_SIZE))
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