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

    for (let i = 0; i < FIELD_SIZE / this.size; i++) {
      line(0, this.size * i, FIELD_SIZE, this.size * i)
    }

    for (let i = 0; i < FIELD_SIZE / this.size; i++) {
      line(this.size * i, 0, this.size * i, FIELD_SIZE)
    }
  }
}