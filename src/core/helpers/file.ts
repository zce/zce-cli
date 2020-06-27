import os from 'os'
import extract from 'extract-zip'
import { promises as fs, MakeDirectoryOptions } from 'fs'
import path from 'path'
import rimraf from 'rimraf'

const { name } = require('../../../package.json')

const identify = process.env.NODE_ENV === 'test' ? `${name}-test` : /* istanbul ignore next */ name

export { extract }

/**
 * Remove input path.
 * @param input input path
 * @todo
 * - https://github.com/sindresorhus/trash
 * - native api instead
 */
export const remove = async (input: string, options?: rimraf.Options): Promise<void> =>
  new Promise(resolve => {
    rimraf(input, { glob: false, ...options }, err => {
      /* istanbul ignore if */
      if (err) throw err
      resolve()
    })
  })

/**
 * Make directory recursive.
 * @param input input path
 * @param options recursive by default
 */
export const mkdir = async (input: string, options?: MakeDirectoryOptions): Promise<void> => {
  await fs.mkdir(input, { recursive: true, ...options })
}

/**
 * Checks whether something exists on given path.
 * @param input input path
 */
export const exists = async (input: string): Promise<false | 'file' | 'dir' | 'other'> => {
  try {
    const stat = await fs.stat(input)
    /* istanbul ignore else */
    if (stat.isDirectory()) {
      return 'dir'
    } else if (stat.isFile()) {
      return 'file'
    } else {
      return 'other'
    }
  } catch (err) {
    /* istanbul ignore if */
    if (err.code !== 'ENOENT') {
      throw err
    }
  }
  return false
}

/**
 * Check input is a file.
 * @param input input path
 */
export const isFile = async (input: string): Promise<boolean> => {
  const result = await exists(input)
  return result === 'file'
}

/**
 * Check input is a file.
 * @param input input path
 */
export const isDirectory = async (input: string): Promise<boolean> => {
  const result = await exists(input)
  return result === 'dir'
}

/**
 * Check input is empty.
 * @param input input path
 */
export const isEmpty = async (input: string): Promise<boolean> => {
  const files = await fs.readdir(input)
  return !files.length
}

/**
 * Get temp path.
 * @param paths additional paths
 */
export const getTempPath = (...paths: string[]): string => {
  return path.join(os.tmpdir(), identify, Date.now().toString(), ...paths)
}

/**
 * Get data path.
 * @param paths additional paths
 */
export const getDataPath = (...paths: string[]): string => {
  return path.join(os.homedir(), '.config', identify, ...paths)
}

/**
 * Tildify absolute path.
 * @param input absolute path
 * @see https://github.com/sindresorhus/tildify
 */
export const tildify = (input: string): string => {
  const home = os.homedir()

  // https://github.com/sindresorhus/tildify/issues/3
  input = path.normalize(input) + path.sep

  if (input.indexOf(home) === 0) {
    input = input.replace(home + path.sep, `~${path.sep}`)
  }

  return input.slice(0, -1)
}

/**
 * Untildify absolute path.
 * @param input absolute path
 * @see https://github.com/sindresorhus/untildify
 */
export const untildify = (input: string): string => {
  const home = os.homedir()

  return input.replace(/^~(?=$|\/|\\)/, home)
}
