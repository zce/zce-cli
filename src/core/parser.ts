import minimist from 'minimist'
import buildOptions, { Options } from 'minimist-options'
const pkg = require('../../package.json')

export interface PackageJson extends Record<string, unknown> {
  name: string
  version: string
  description?: string
  homepage?: string
}

export interface Context {
  readonly bin: string
  readonly primary?: string
  readonly secondary?: string
  readonly thirdly?: string
  readonly fourthly?: string
  readonly extras: string[]
  readonly inputs: string[]
  readonly options: Record<string, unknown>
  readonly pkg: PackageJson
}

export { Options }

/**
 * parse context from cli argv
 * @param args cli argv
 * @param opts command options
 * @todo pkg.bin === undefined
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
  const options = Object.keys(result).reduce((o, i) => (keys.includes(i) ? { ...o, [i]: result[i] } : o), {})

  // return context
  return { bin, primary, secondary, thirdly, fourthly, extras, inputs, options, pkg }
}
