const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { exec } = require('child_process')

const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const home = os.homedir()
const tmp = os.tmpdir()

/**
 * Command identify
 * @type {string}
 */
// istanbul ignore next
const identify = process.env.NODE_ENV === 'test' ? 'zce-test' : 'zce'

/**
 * Check path exists.
 * @param {string} input input path
 */
exports.exists = input => new Promise(resolve => {
  fs.stat(input, err => resolve(!err))
})

/**
 * Check input path is directory.
 * @param {string} input input path
 */
exports.isDirectory = input => new Promise((resolve, reject) => {
  fs.stat(input, (err, stat) => {
    if (err) return reject(err)
    resolve(stat.isDirectory())
  })
})

/**
 * Check input path is filename.
 * @param {string} input input path
 */
exports.isFile = input => new Promise((resolve, reject) => {
  fs.stat(input, (err, stat) => {
    if (err) return reject(err)
    resolve(stat.isFile())
  })
})

/**
 * Check input is empty.
 * @param {string} input input path
 */
exports.isEmpty = input => new Promise((resolve, reject) => {
  fs.readdir(input, (err, files) => {
    if (err) return reject(err)
    resolve(!files.length)
  })
})

/**
 * Tildify input path.
 * @param {string} input input path
 */
exports.tildify = input => {
  input = path.normalize(input)
  // // https://github.com/sindresorhus/tildify/issues/3#issuecomment-139471745
  // return input.startsWith(home) ? input.replace(home, '~') : input

  if (input === home) return '~'

  return input.startsWith(home + path.sep) ? input.replace(home, '~') : input
}

/**
 * Untildify input path.
 * @param {string} input input path
 */
exports.untildify = input => {
  input = path.normalize(input)
  return input.startsWith('~') ? input.replace('~', home) : input
}

/**
 * rimraf.
 * @param {string} input input path
 */
exports.rimraf = input => new Promise((resolve, reject) => {
  rimraf(input, err => {
    // istanbul ignore if
    if (err) return reject(err)
    resolve()
  })
})

/**
 * mkdirp.
 * @param {string} input input path
 */
exports.mkdirp = input => new Promise((resolve, reject) => {
  mkdirp(input, err => {
    // istanbul ignore if
    if (err) return reject(err)
    resolve()
  })
})

/**
 * Get data path.
 * @param {string[]} paths path
 */
exports.getDataPath = (...paths) => {
  return path.join(home, '.config', identify, ...paths)
}

/**
 * Get temp path.
 * @param {string[]} paths path
 */
exports.getTempPath = (...paths) => {
  return path.join(tmp, identify, ...paths)
}

/**
 * Encrypt the plain text string to MD5.
 * @param {string} input plain text
 */
exports.md5 = input => {
  return crypto.createHash('md5').update(input).digest('hex')
}

/**
 * Execute a command return result
 * @param {string} command command text
 * @param {string} cwd     cwd path (optional)
 */
exports.execute = (command, cwd) => new Promise(resolve => {
  // istanbul ignore next
  cwd = cwd || process.cwd()
  exec(command, { cwd }, (err, stdout, stderr) => {
    // istanbul ignore if
    if (err) return resolve()
    resolve(stdout.toString().trim())
  })
})
