import fs from 'fs'
import util from 'util'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import tildify from 'tildify'
import untildify from 'untildify'

// Re-exports
// https://github.com/microsoft/TypeScript/issues/2726
// export { default as rimraf } from 'rimraf'
// export { default as mkdirp } from 'mkdirp'
// export { default as tildify } from 'tildify'
// export { default as untildify } from 'untildify'

export { rimraf, mkdirp, tildify, untildify }

/**
 * Get filename stat.
 * @param input input path
 */
export const stat = util.promisify(fs.stat)

/**
 * Read dir.
 * @param input input path
 */
export const readdir = util.promisify(fs.readdir)

/**
 * Check path exists.
 * @param input input path
 */
export const exists = async (input: string): Promise<boolean> => {
  try {
    await stat(input)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check input is empty.
 * @param input input path
 */
export const isEmpty = async (input: string): Promise<boolean> => {
  const files = await readdir(input)
  return !files.length
}

/**
 * Check input is a file.
 * @param input input path
 */
export const isFile = async (input: string): Promise<boolean> => {
  const s = await stat(input)
  return s.isFile()
}

/**
 * Check input is a file.
 * @param input input path
 */
export const isDirectory = async (input: string): Promise<boolean> => {
  const s = await stat(input)
  return s.isDirectory()
}
