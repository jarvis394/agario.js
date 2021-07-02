const {
  BLOCKS_SIZE,
  BLOB_RADIUS,
  FIELD_SIZE
} = require("../constants")
const { random, randomColor } = require("./functions")

class Blob {
  constructor() {
    this.x = random(0, FIELD_SIZE) // X pos
    this.y = random(0, FIELD_SIZE) // Y pos 
    this.r = random(BLOB_RADIUS, BLOB_RADIUS * 1.3) // Radius
    this.c = randomColor().body
  }
}

module.exports = Blob