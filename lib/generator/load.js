/**
 * Load template options
 * TODO:
 * - template validate
 * - docs tips
 * @param {String} src source path
 */
module.exports = async src => {
  try {
    return require(src)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e
    // throw new Error('This template is invalid.')
    return {}
  }
}
