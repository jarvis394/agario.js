/**
 * Create random bright contrast color
 * @function
 */
function randomColor() {
  let color = Math.floor(random(0, 360))
  let body = `hsla(${color}, 100%, 50%, 1)`
  let border = `hsla(${color}, 100%, 35%, 1)`

  return {
    body: body,
    border: border
  }
}

/**
 * Returns random num between 'min' and 'max'
 * @param {number} min Minimum
 * @param {number} max Maximum
 */
const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

module.exports = {
  randomColor,
  random
}