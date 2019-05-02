import { template } from 'lodash'

const imports = {}

/**
 * Register helpers
 * @param {Object} helpers helper
 */
export const registerHelpers = (helpers: {}): void => {
  Object.assign(imports, helpers)
}

/**
 * Render a template string as lodash template
 * @param  {string} input    Template string
 * @param  {Object} data     Template data
 * @param  {Object} options  Template options
 * @return {string}          Render result
 */
export const render = (input: string, data: {}, options?: {}): string => {
  options = Object.assign({ imports }, options)
  const compiled = template(input, options)
  return compiled(data)
}
