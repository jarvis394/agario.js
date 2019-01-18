const {
  BLOCKS_SIZE,
  BLOBS_COUNT
} = require("../constants")
const Blob = require("./Blob")

class Block {
  constructor(row, col) {
    this.x = row * BLOCKS_SIZE // X pos
    this.y = col * BLOCKS_SIZE // Y pos 
    this.blobs = []
    this.players = {}
  }

  createBlobs() {
    for (let i = 0; i < BLOBS_COUNT; i++) {
      this.blobs.push(new Blob(this.x, this.y))
    }
  }
}

module.exports = Block