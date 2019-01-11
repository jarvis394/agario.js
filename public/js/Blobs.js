
/**
 * Blob object
 * @class
 */
class Blob {

  constructor() {
    this.pos = createVector(random(-FIELD_SIZE, FIELD_SIZE * 2), random(-FIELD_SIZE, FIELD_SIZE * 2))
    this.radius = floor(random(BLOB_RADIUS, BLOB_RADIUS * 1.3))
    this.color = randomColor().body
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