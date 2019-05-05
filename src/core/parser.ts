import { basename } from 'path'

import * as minimist from 'minimist'
import buildOptions, { Options } from 'minimist-options'

import { Context } from './types'

/**
 * parse context from cli argv
 * @param argv cli argv
 * @param opts command options
 */
export const parse = async (
  argv: string[],
  opts?: Options
): Promise<Context> => {
  opts = opts || {}
  // mount package.json
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require('../../package.json')

  // cli brand name
  const brand =
    typeof pkg.bin === 'string'
      ? basename(pkg.bin, '.js')
      : Object.keys(pkg.bin)[0]

  // parse argv by minimist
  const options = minimist(argv, buildOptions(opts))

  // row input args
  const input = options._

  // extract arguments
  const [primary, secondary, thirdly, fourthly, ...extras] = input

  // excluding aliases
  Object.values(opts).forEach(item => {
    if (typeof item !== 'string' && item.alias) {
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
