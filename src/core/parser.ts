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
  const options = minimist(args, buildOptions(opts))

  // row input args
  const { _: inputs } = options

  // extract arguments
  const [primary, secondary, thirdly, fourthly, ...extras] = inputs

  // excluding aliases
  Object.values(opts).forEach(item => {
    if (typeof item !== 'object' || !item.alias) return
    if (typeof item.alias === 'string') {
      delete options[item.alias]
    } else {
      item.alias.forEach(a => delete options[a])
    }
  })

  // excluding arguments
  delete options._

  // return context
  return { bin, primary, secondary, thirdly, fourthly, extras, inputs, options, pkg }
}
