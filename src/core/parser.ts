import { basename } from 'path'
import minimist from 'minimist'
import buildOptions from 'minimist-options'
import { Context, Options } from './types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../package.json')

/**
 * parse context from cli argv
 * @param argv cli argv
 * @param opts command options
 */
export const parse = async (argv: string[], opts?: Options): Promise<Context> => {
  opts = opts || {}
  // cli brand name
  const brand = typeof pkg.bin === 'string' ? basename(pkg.bin, '.js') : Object.keys(pkg.bin)[0]

  // parse argv by minimist
  const options = minimist(argv, buildOptions(opts))

  // row input args
  const input = options._

  // extract arguments
  const [primary, secondary, thirdly, fourthly, ...extras] = input

  // excluding aliases
  Object.values(opts).forEach(item => {
    if (typeof item === 'object' && item.alias) {
      if (typeof item.alias === 'string') {
        delete options[item.alias]
      } else {
        item.alias.forEach(a => delete options[a])
      }
    }
  })

  // excluding arguments
  delete options._

  // return context
  return {
    brand,
    primary,
    secondary,
    thirdly,
    fourthly,
    extras,
    input,
    options,
    pkg
  }
}
