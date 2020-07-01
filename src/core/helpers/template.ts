import template from 'lodash/template'
import { TemplateOptions } from 'lodash'

const imports: Record<string, unknown> = {}

/**
 * Register helpers.
 * @param helpers helper functions or data
 */
export const registerHelpers = (helpers: Record<string, unknown>): void => {
  Object.assign(imports, helpers)
}

/**
 * Render a template string as lodash template.
 * @param input template string
 * @param data template data
 * @param options template options
 * @return render result
 */
export const render = (input: string, data: Record<string, unknown>, options?: TemplateOptions): string => {
  options = Object.assign({ imports }, options)
  const compiled = template(input, options)
  return compiled(data)
}

// /**
//  * Compile an ES6 template literals string to a Template function.
//  * @param source ES6 template literals.
//  */
// export const compile = (source: string) => {
//   return (context: Record<string, unknown>) => {
//     const props = Object.keys(context).join(', ')
//     return new Function(`{ ${props} }`, `return \`${source}\``)(context)
//   }
// }
