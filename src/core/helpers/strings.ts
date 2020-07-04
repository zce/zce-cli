import crypto from 'crypto'
import template from 'lodash/template'
import { TemplateOptions } from 'lodash'

/**
 * Render a template string as lodash template.
 * @param input template string
 * @param data template data
 * @param options template options
 * @return render result
 */
export const render = (input: string, data: Record<string, unknown>, options?: TemplateOptions): string => {
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

/**
 * Compute md5 hash result
 * @param input source input strings
 * @return md5 strings
 */
export const md5 = (input: string): string => {
  return crypto.createHash('md5').update(input).digest('hex')
}
