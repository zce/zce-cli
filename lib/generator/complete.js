const { logger, template } = require('../common')

/**
 * Template complete execute
 * @param {String|Function} complete template complete callback
 * @param {Object}          context  generator context
 */
module.exports = (complete, context = {}) => {
  // complete
  if (typeof complete === 'function') {
    complete(context)
  } else if (typeof complete === 'string') {
    logger.log()
    logger.log(template.render(complete, context))
    logger.log()
  } else {
    throw new TypeError(`Expected a string or function, but got ${typeof complete}`)
  }
}
