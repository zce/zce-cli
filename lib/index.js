// TODO: Implement module
module.exports = (name, options) => {
  if (typeof name !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof name}`)
  }

  options = Object.assign({}, options)

  return `${name}@${options.host || 'zce.me'}`
}
