const chalk = require('chalk')
const { logger, template, util } = require('../common')

/**
 * Template complete execute
 * @param {String|Function} complete template complete callback
 * @param {Object}          context  generator context
 */
module.exports = (complete, context = {}) => {
  logger.log() // padding

  if (typeof complete === 'function') {
    complete(context)
  } else if (typeof complete === 'string') {
    logger.log(template.render(complete, context))
  } else {
    logger.log(`🎉  "${context.answers.name}" generated into ${chalk.yellow(util.tildify(context.dest))}`)
  }

  logger.log() // padding
}
