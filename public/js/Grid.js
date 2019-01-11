class Grid {

  constructor(size) {
    this.size = size;
  }

  /**
   * Draws grid
   * @function
   */
  draw() {
    stroke(100, 100, 150, 32)
    strokeWeight(1)

    for (let i = -(FIELD_SIZE / this.size); i < 2 * FIELD_SIZE / this.size; i++) {
      line(-FIELD_SIZE, this.size * i, FIELD_SIZE * 2, this.size * i)
    }

    for (let i = -(FIELD_SIZE / this.size); i < 2 * FIELD_SIZE / this.size; i++) {
      line(this.size * i, -FIELD_SIZE, this.size * i, FIELD_SIZE * 2)
    }
  }
}