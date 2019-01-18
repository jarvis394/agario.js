const {
  BLOCKS_SIZE,
  BLOB_RADIUS
} = require("../constants")
const { random, randomColor } = require("./functions")

class Blob {
  constructor(x, y) {
    this.x = random(x, x + BLOCKS_SIZE) // X pos
    this.y = random(y, y + BLOCKS_SIZE) // Y pos 
    this.r = random(BLOB_RADIUS, BLOB_RADIUS * 1.3) // Radius
    this.c = randomColor().body
  }
}

module.exports = Blob