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
    if (e.code !== 'MODULE_NOT_FOUND' || e.message !== `Cannot find module '${src}'`) {
      e.message = `This template is invalid: ${e.message}`
      throw e
    }

    // return default template options
    return {}
  }
}
