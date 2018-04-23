const _ = require('lodash')

const imports = {}

/**
 * Register helpers
 * @param {Object} helpers helper
 */
exports.registerHelpers = helpers => {
  Object.assign(imports, helpers)
}

/**
 * Render a template string as lodash template
 * @param  {String} template Template string
 * @param  {Object} data     Template data
 * @param  {Object} options  Template options
 * @return {String}          Render result
 */
exports.render = (template, data, options) => {
  // // ignore files that do not have mustaches
  // if (!/{{([^{}]+)}}/g.test(template)) return template
  options = Object.assign({ imports }, options)
  const compiled = _.template(template, options)
  return compiled(data)
}
