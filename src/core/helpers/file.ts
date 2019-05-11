import fs from 'fs'

import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import tildify from 'tildify'
import untildify from 'untildify'

/**
 * Get filename stat.
 * @param input input path
 */
export const stat = (input: string) =>
  new Promise((resolve, reject) => {
    fs.stat(input, (err, stat) => {
      if (err) return reject(err)
      resolve(stat)
    })
  })

/**
 * Check path exists.
 * @param input input path
 */
export const exists = (input: string) =>
  new Promise(resolve => {
    stat(input)
      .then(stat => resolve(true))
      .catch(err => resolve(false))
  })

/**
 * Check input is empty.
 * @param input input path
 */
export const isEmpty = (input: string) =>
  new Promise((resolve, reject) => {
    fs.readdir(input, (err, files) => {
      if (err) return reject(err)
      resolve(!files.length)
    })
  })

export { rimraf, mkdirp, tildify, untildify }
