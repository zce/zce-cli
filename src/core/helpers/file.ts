import fs from 'fs'

export { default as rimraf } from 'rimraf'
export { default as mkdirp } from 'mkdirp'
export { default as tildify } from 'tildify'
export { default as untildify } from 'untildify'

/**
 * Get filename stat.
 * @param input input path
 */
export const stat = (input: string): Promise<fs.Stats> => {
  return new Promise((resolve, reject) => {
    fs.stat(input, (err, stat) => {
      if (err) return reject(err)
      resolve(stat)
    })
  })
}

/**
 * Check path exists.
 * @param input input path
 */
export const exists = (input: string): Promise<boolean> => {
  return stat(input)
    .then(() => true)
    .catch(() => false)
}

/**
 * Check input is empty.
 * @param input input path
 */
export const isEmpty = (input: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.readdir(input, (err, files) => {
      if (err) return reject(err)
      resolve(!files.length)
    })
  })
}
