class Player {
  constructor(x, y, r, b, bc, n, id) {
    this.x = x // X pos
    this.y = y // Y pos 
    this.r = r // Radius
    this.b = b // Body color
    this.bc = bc // Border color
    this.id = id // ID
    this.n = n // Nickname
    this.block = {
      row: 0,
      col: 0
    }
  }
}

module.exports = Player