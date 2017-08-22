const Handlebars = require('handlebars')
const camelCase = require('camelcase')

Handlebars.registerHelper({
  eq (a, b, opts) {
    return a === b ? opts.fn(this) : opts.inverse(this)
  },
  camel (input) {
    return camelCase(input)
  }
})

/**
 * Register helper
 */
exports.registerHelper = (...args) => {
  return Handlebars.registerHelper(...args)
}

/**
 * Render a mustache string as handlebars template
 * @param  {String} template Mustache string
 * @param  {Object} data     Template data
 * @param  {Object} options  Template options
 * @return {String}          Render result
 */
exports.render = (template, data, options) => {
  // ignore files that do not have mustaches
  if (!/{{([^{}]+)}}/g.test(template)) return template

  const handlebars = Handlebars.compile(template, {
    strict: process.env.NODE_ENV === 'development',
    noEscape: true
  })

  return handlebars(data, options)
}
