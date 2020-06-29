import { cosmiconfig, Options } from 'cosmiconfig'
const pkg = require('../../../package.json')

// https://github.com/davidtheclark/cosmiconfig#caching
// const cache: Record<string, Record<string, unknown>> = {}

/**
 * Get module config
 * @param name module name
 * @param from search from
 * @param options cosmiconfig options
 * @todo pkg.bin === undefined
 */
export const get = async (name?: string, from?: string, options?: Options): Promise<Record<string, unknown>> => {
  if (typeof name === 'undefined') {
    const bin: string = typeof pkg.bin === 'string' ? pkg.name : Object.keys(pkg.bin)[0]
    name = bin
  }
  // if (cache[name]) return cache[name]
  const explorer = cosmiconfig(name, options)
  const { config = {} } = (await explorer.search(from)) || {}
  return config
}
