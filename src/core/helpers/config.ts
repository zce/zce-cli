import os from 'os'
import fs from 'fs'
import path from 'path'
import { parse } from 'ini'
import username from 'username'
import fullname from 'fullname'
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
export const get = async <T> (name?: string, from?: string, options?: Options): Promise<Record<string, T>> => {
  if (typeof name === 'undefined') {
    const bin: string = typeof pkg.bin === 'string' ? pkg.name : Object.keys(pkg.bin)[0]
    name = bin
  }
  // if (cache[name]) return cache[name]
  const explorer = cosmiconfig(name, options)
  const { config = {} } = (await explorer.search(from)) || {}
  return config
}

/**
 * Read ini config file.
 * @param filename ini file name
 */
export const ini = async <T> (filename: string): Promise<Record<string, T> | undefined> => {
  try {
    const contents = await fs.promises.readFile(filename, 'utf8')
    return parse(contents)
  } catch {}
}

/**
 * Get npmrc config.
 */
export const npm = async (): Promise<Record<string, string> | undefined> => {
  const npmrc = path.join(os.homedir(), '.npmrc')
  return ini(npmrc)
}

/**
 * Get yarnrc config.
 */
export const yarn = async (): Promise<Record<string, string> | undefined> => {
  const yarnrc = path.join(os.homedir(), '.yarnrc')
  return ini(yarnrc)
}

/**
 * Get git config.
 */
export const git = async (): Promise<Record<string, string> | undefined> => {
  const gitconfig = path.join(os.homedir(), '.gitconfig')
  return ini(gitconfig)
}

export { username, fullname }
