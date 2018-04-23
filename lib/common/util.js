const os = require('os')
const fs = require('fs')
const url = require('url')
const path = require('path')
const crypto = require('crypto')

const rc = require('rc')
const ora = require('ora')
const chalk = require('chalk')
const semver = require('semver')

const http = require('./http')
const logger = require('./logger')

const pkg = require('../../package')

const home = os.homedir()
const tmp = os.tmpdir()

/**
 * Command identify
 * @type {String}
 */
const identify = process.env.NODE_ENV === 'test' ? 'zce-test' : 'zce'

// #region path functions

/**
 * Check path exists.
 * @param {String} input input path
 */
exports.exists = input => new Promise(resolve => {
  fs.stat(input, err => resolve(!err))
})

/**
 * Check input path is directory.
 * @param {String} input input path
 */
exports.isDirectory = input => new Promise((resolve, reject) => {
  fs.stat(input, (err, stat) => {
    if (err) return reject(err)
    resolve(stat.isDirectory())
  })
})

/**
 * Check input path is filename.
 * @param {String} input input path
 */
exports.isFile = input => new Promise((resolve, reject) => {
  fs.stat(input, (err, stat) => {
    if (err) return reject(err)
    resolve(stat.isFile())
  })
})

/**
 * Check input is empty.
 * @param {String} input input path
 */
exports.isEmpty = input => new Promise((resolve, reject) => {
  fs.readdir(input, (err, files) => {
    if (err) return reject(err)
    resolve(!files.length)
  })
})

/**
 * Tildify input path.
 * @param {String} input input path
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
 * @param {String} input input path
 */
exports.untildify = input => {
  input = path.normalize(input)
  return input.startsWith('~') ? input.replace('~', home) : input
}

// #endregion

/**
 * Encrypt the plain text string to MD5.
 * @param {String} input plain text
 */
exports.md5 = input => {
  return crypto.createHash('md5').update(input).digest('hex')
}

/**
 * Get data path.
 * @param {String[]} paths path
 */
exports.getDataPath = (...paths) => {
  return path.join(home, '.config', identify, ...paths)
}

/**
 * Get temp path.
 * @param {String[]} paths path
 */
exports.getTempPath = (...paths) => {
  return path.join(tmp, identify, ...paths)
}

/**
 * Check for update.
 */
exports.checkUpdate = async () => {
  const spinner = ora('Checking for updates...')
  spinner.start()

  const npmrc = rc('npm', { registry: 'https://registry.npmjs.org/' })

  // fetch remote latest version
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
  const res = await http.request(url.resolve(npmrc.registry, pkg.name, 'latest'))

  spinner.stop()

  const latest = res.body.version

  if (semver.gt(pkg.version, latest)) return false

  logger.boxen(
    `Update available ${chalk.red(pkg.version)} → ${chalk.green(latest)}\n` +
    `Please run ${chalk.cyan(`yarn global add ${pkg.name}`)} to update`
  )

  return true
}
