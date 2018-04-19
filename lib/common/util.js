/**
 * Utils
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// #region path

/**
 * Check dir exists.
 * @param {String} dir dir path
 */
exports.existsDir = async dir => {
  return new Promise(resolve => {
    fs.stat(dir, (err, stat) => {
      if (err) return resolve(false)
      resolve(stat.isDirectory())
    })
  })
}

/**
 * Check dir is empty.
 * @param {String} dir dir path
 */
exports.isEmptyDir = async dir => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err)
      resolve(!files.length)
    })
  })
}

/**
 * Tildify input path.
 * @param {String} imput input path
 */
exports.tildify = input => {
  input = path.normalize(input)
  const homedir = os.homedir()
  return input.includes(homedir) ? input.replace(homedir, '~') : input
}

/**
 * Untildify input path.
 * @param {String} imput input path
 */
exports.untildify = input => {
  input = path.normalize(input)
  const homedir = os.homedir()
  return input.includes('~') ? input.replace('~', homedir) : input
}

// #endregion

// #region utils

/**
 * Encrypt the plain text string to MD5.
 * @param {String} input plain text
 */
exports.md5 = input => {
  return crypto.createHash('md5').update(input).digest('hex')
}

// #endregion
