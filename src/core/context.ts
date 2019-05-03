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

  // cli brand name
  const brand = basename(process.argv[1], '.js')

  // parse argv by minimist
  const options = minimist(argv, buildOptions(opts))

  // row input args
  const input = options._

  // extract arguments
  const [primary, secondary, thirdly, fourthly, ...extras] = input

  // excluding aliases
  Object.values(opts).forEach(item => {
    if (typeof item !== 'string' && item.alias) {
      if (!item.alias) return
      if (typeof item.alias === 'string') {
        delete options[item.alias]
      } else {
        item.alias.forEach(a => delete options[a])
      }
    }
  })

  // excluding arguments
  delete options._

  // mount package.json
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pkg = require('../../package.json')

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
