import minimist from 'minimist'
import buildOptions from 'minimist-options'
import { Context, Options } from './types'
const pkg = require('../../package.json')

/**
 * parse context from cli argv
 * @param args cli argv
 * @param opts command options
 */
export const parse = async (args: string[], opts: Options = {}): Promise<Context> => {
  // cli bin name
  const bin = typeof pkg.bin === 'string' ? pkg.name : Object.keys(pkg.bin)[0]

  // parse argv by minimist
  const result = minimist(args, buildOptions(opts))

  // row input args
  const { _: inputs } = result

  // extract arguments
  const [primary, secondary, thirdly, fourthly, ...extras] = inputs

  // pick options
  const keys = Object.keys(opts)
  const options = Object.keys(result).reduce((o, i) => keys.includes(i) ? { ...o, [i]: result[i] } : o, {})

  // return context
  return { bin, primary, secondary, thirdly, fourthly, extras, inputs, options, pkg }
}
