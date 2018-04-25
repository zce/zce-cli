const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { exec } = require('child_process')

const rc = require('rc')
const ora = require('ora')
const chalk = require('chalk')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
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
// istanbul ignore next
const identify = process.env.NODE_ENV === 'test' ? 'zce-test' : 'zce'

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
 * rimraf.
 * @param {String} input input path
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
 * @param {String} input input path
 */
exports.mkdirp = input => new Promise((resolve, reject) => {
  mkdirp(input, err => {
    // istanbul ignore if
    if (err) return reject(err)
    resolve()
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
 * Encrypt the plain text string to MD5.
 * @param {String} input plain text
 */
exports.md5 = input => {
  return crypto.createHash('md5').update(input).digest('hex')
}

/**
 * Execute a command return result
 * @param {String} command command text
 * @param {String} cwd     cwd path (optional)
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

/**
 * Check for update.
 */
exports.checkUpdate = async () => {
  const spinner = ora('Checking for updates...')
  spinner.start()

  const { registry } = rc('npm', { registry: 'https://registry.npmjs.org/' })

  // fetch remote latest version
  // https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
  const res = await http.request(`${registry}${pkg.name}/latest`)

  spinner.stop()

  const latest = res.body.version

  if (semver.gte(pkg.version, latest)) return false

  logger.boxen(
    `Update available ${chalk.red(pkg.version)} → ${chalk.green(latest)}\n` +
    `Please run ${chalk.cyan(`yarn global add ${pkg.name}`)} to update`
  )

  return true
}
