import { template } from 'lodash'

const imports = {}

/**
 * Register helpers
 * @param helpers helper
 */
export const registerHelpers = (helpers: {}): void => {
  Object.assign(imports, helpers)
}

/**
 * Render a template string as lodash template
 * @param input Template string
 * @param data Template data
 * @param options Template options
 * @return Render result
 */
export const render = (input: string, data: {}, options?: {}): string => {
  options = Object.assign({ imports }, options)
  const compiled = template(input, options)
  return compiled(data)
}
