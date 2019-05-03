import { basename } from 'path'

import * as minimist from 'minimist'
import buildOptions, { Options } from 'minimist-options'

import { Context } from './types'

/**
 * parse context from cli argv
 * @param argv cli argv
 * @param opts command options
 */
export const parse = async (argv: string[], opts?: Options): Promise<Context> => {
  // cli brand name
  const brand = basename(process.argv[1], '.js')

  // parse argv by minimist
  const result = minimist(argv, buildOptions(opts))

  // row input args
  const input = result._

  // extract arguments
  const [primary, secondary, thirdly, fourthly, ...extras] = input

  // options (excluding aliases)
  const options = opts
    ? Object.keys(opts).reduce((o, i) => ({ [i]: result[i], ...o }), {})
    : {}

  // mount package.json
  const pkg = require('../../package.json') // eslint-disable-line @typescript-eslint/no-var-requires

  // return context
  return { brand, primary, secondary, thirdly, fourthly, extras, input, options, pkg }
}
