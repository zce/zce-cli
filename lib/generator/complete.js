const _ = require('lodash')

/**
 * Template complete execute
 * @param {Any}    complete template complete callback
 * @param {Object} context  generator context
 */
module.exports = (complete, context) => {
  // complete
  if (typeof complete === 'function') {
    complete(context)
  } else if (typeof complete === 'string') {
    console.log() // padding
    console.log(_.template(complete, context))
    console.log()
  } else {
    throw new TypeError()
  }
}
