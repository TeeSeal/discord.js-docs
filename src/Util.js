class Util {
  constructor () {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`)
  }

  static flatten (array, depth = 5) {
    return depth !== 1
      ? array.reduce(
        (arr, value) => arr.concat(Array.isArray(value) ? Util.flatten(value, depth - 1) : value),
        []
      )
      : array.reduce((arr, value) => arr.concat(value), [])
  }
}

module.exports = Util
