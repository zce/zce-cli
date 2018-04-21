/**
 * Load template options
 * TODO:
 * - template validate
 * - docs tips
 * @param {String} src source path
 */
module.exports = async src => {
  try {
    const options = require(src)

    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }

    return options
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
    // throw new Error('This template is invalid.')
    // default template options
    return {}
  }
}
