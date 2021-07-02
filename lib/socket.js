const Player = require("./Player")
const {
  BLOCKS_COUNT,
  BLOCKS_SIZE
} = require("../constants")
const colors = require("colors")

module.exports = (io, players, field, blobs) => {
  io.sockets.on('connection', socket => {

    console.log("> [LOG] New client:".green, `${socket.id}`.gray)
    
    // Send to socket info about players to create 'Player' objects
    socket.emit('blobs', {
      blobs: blobs
    })

    // Socket started playing
    socket.on('start', (data) => {
      let player = new Player(data.x, data.y, data.r, data.b, data.bc, data.n, socket.id)
      players[socket.id] = player

      // Get block
      let pos = findBlock(data.x, data.y)
      
      let posX = pos[0]
      let posY = pos[1]

      players[socket.id].block.row = posX
      players[socket.id].block.col = posY

      // Send to socket info about players to create 'Player' objects
      socket.emit('start', {
        block: [posX, posY],
        players: players,
        blobs: blobs
      })

      console.log("> [LOG] Player", `${socket.id}`.gray, "started playing at block", `${pos}`.magenta)

      // Say that to clients
      io.sockets.emit("newPlayer", player)
    });

    // Socket sends an update
    socket.on('update', (data) => {
      if (!players[socket.id]) return
      
      let pos = findBlock(data.x, data.y)
      let posX, posY

      if (!pos) {
        posX = players[socket.id].block.row
        posY = players[socket.id].block.col
      } else {
        posX = pos[0]
        posY = pos[1]
      }

      if (players[socket.id] && (players[socket.id].block.row !== posX || players[socket.id].block.col !== posY)) {
        delete field[posX][posY].players[socket.id]

        field[posX][posY].players[socket.id] = {
          x: data.x,
          y: data.y,
          r: data.r
        }

        players[socket.id].block.row = posX
        players[socket.id].block.col = posY
      }

      players[socket.id].x = data.x
      players[socket.id].y = data.y
      players[socket.id].r = data.r
    });

    // Socket disconnects
    socket.on('disconnect', (reason) => {
      // Remove player
      delete players[socket.id]

      // Say that to sockets
      io.sockets.emit("removePlayer", socket.id)
      
      console.log("> [LOG] Client".red, `${socket.id}`.gray, "disconnected by:".red, reason)
    });

    // Socket eats blob
    socket.on('eatBlob', (i) => {
      blobs.splice(i, 1)
      io.sockets.emit("removeBlob", {
        i: i,
        id: socket.id
      })
    });
    
    socket.on("removePlayer", id => {
      delete players[id]
      
      console.log("> [LOG]", id, "was eaten by", socket.id)
      
      io.sockets.emit("removePlayer", {
        id: id,
        eater: socket.id
      });
    });

  });

  /**
   * Finds index of block, that should contain player
   * @param {number} x X position of the player
   * @param {number} y Y position of the player
   */
  function findBlock(x, y) {
    let pos = 0

    for (let i = 0; i < BLOCKS_COUNT; i++) {
      pos = field[i].findIndex(block => {
        let xConstrain = block.x <= x && x <= block.x + BLOCKS_SIZE
        let yConstrain = block.y <= y && y <= block.y + BLOCKS_SIZE

        return xConstrain && yConstrain
      })

      if (pos !== -1) return [i, pos]
    }

    return false
    
    /*let pos = [
      Math.floor((BLOCKS_COUNT * BLOCKS_SIZE) / x),
      Math.floor((BLOCKS_COUNT * BLOCKS_SIZE) / y)
      ]
    
    return pos*/
  }


  /*function getNeighbourBlobs(posX, posY) {
    let neighbourBlobs = field[posX][posY].blobs.concat(
      field[posX - 1] && field[posX - 1][posY - 1] ? field[posX - 1][posY - 1].blobs : [],
      field[posX] && field[posX][posY - 1] ? field[posX][posY - 1].blobs : [],
      field[posX + 1] && field[posX + 1][posY - 1] ? field[posX + 1][posY - 1].blobs : [],

      field[posX - 1] && field[posX - 1][posY] ? field[posX - 1][posY].blobs : [],
      field[posX + 1] && field[posX + 1][posY] ? field[posX + 1][posY].blobs : [],

      field[posX - 1] && field[posX - 1][posY + 1] ? field[posX - 1][posY + 1].blobs : [],
      field[posX] && field[posX][posY + 1] ? field[posX][posY + 1].blobs : [],
      field[posX + 1] && field[posX + 1][posY + 1] ? field[posX + 1][posY + 1].blobs : [],
    )

    // let neighbourBlobs = []

    // if (field[posX - 1] && field[posX - 1][posY - 1])
    //   neighbourBlobs.push(field[posX - 1][posY - 1].blobs)
    // if (field[posX] && field[posX][posY - 1])
    //   neighbourBlobs.push(field[posX][posY - 1].blobs)
    // if (field[posX + 1] && field[posX + 1][posY - 1])
    //   neighbourBlobs.push(field[posX + 1][posY - 1].blobs)

    // if (field[posX - 1] && field[posX - 1][posY])
    //   neighbourBlobs.push(field[posX - 1][posY].blobs)
    // if (field[posX + 1] && field[posX + 1][posY])
    //   neighbourBlobs.push(field[posX + 1][posY].blobs)

    // if (field[posX - 1] && field[posX - 1][posY + 1])
    //   neighbourBlobs.push(field[posX - 1][posY + 1].blobs)
    // if (field[posX] && field[posX][posY + 1])
    //   neighbourBlobs.push(field[posX][posY + 1].blobs)
    // if (field[posX + 1] && field[posX + 1][posY + 1])
    //   neighbourBlobs.push(field[posX + 1][posY + 1].blobs)

    return neighbourBlobs
  }*/
}