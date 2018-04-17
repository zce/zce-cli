/**
 * Utils
 */

const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const readline = require('readline')

const rc = require('rc')
const ora = require('ora')
const got = require('got')
const chalk = require('chalk')
const boxen = require('boxen')
const semver = require('semver')
const symbols = require('log-symbols')
const download = require('download')

const pkg = require('../package')

const defaultHeaders = {
  'user-agent': `${pkg.name}/${pkg.version} (${pkg.homepage})`
}

// #region logger

/**
 * Log message with a success symbol.
 * @param {String} message message
 */
exports.success = message => {
  console.log(symbols.success, message)
}

/**
 * Log message with a error symbol.
 * @param {String} message message
 */
exports.error = message => {
  console.error(symbols.error, message)
}

/**
 * Log message with a warn symbol.
 * @param {String} message message
 */
exports.warn = message => {
  console.warn(symbols.warning, message)
}

/**
 * Log message with a info symbol.
 * @param {String} message message
 */
exports.info = message => {
  console.info(symbols.info, message)
}

/**
 * Boxen log message.
 * @param {String} message message
 */
exports.boxen = message => {
  const styles = { padding: 1, margin: 1, borderColor: 'yellow', borderStyle: 'round', dimBorder: false }
  console.log(boxen(message, styles))
}

/**
 * Clear console.
 * @param {String} title default title
 */
exports.clearConsole = title => {
  // istanbul ignore if
  if (!process.stdout.isTTY) return
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  title && console.log(title)
}

// #endregion

// #region path

/**
 * Check dir exists.
 * @param {String} dir dir path
 */
exports.existsDir = dir => {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (e) {
    return false
  }
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

// #region http

/**
 * Send http request.
 * @param {String} url     url
 * @param {Object} options options
 */
exports.request = async (url, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({}, defaultHeaders, options.headers)

  // timeout & content type
  options.timeout = options.timeout || 10000
  options.json = options.json || true

  return got(url, options)
}

/**
 * Download remote resource
 * @param {String} url     url
 * @param {String} dest    destination
 * @param {Object} options options
 */
exports.download = async (url, dest, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({}, defaultHeaders, options.headers)

  return download(url, dest, options)
}

// #endregion

// #region check version

/**
 * node version check
 */
// istanbul ignore next
exports.checkNodeVersion = () => {
  if (semver.satisfies(process.version, pkg.engines.node)) return true

  console.log(chalk.red(`You are using Node.js ${chalk.yellow(process.version)}, but this version of ${chalk.cyan(pkg.name)} requires Node.js ${chalk.green(pkg.engines.node)}.`))
  console.log(chalk.red('Please upgrade your Node.js version before this operation.'))

  process.exit(1)
}

/**
 * Update check
 */
exports.checkPackageVersion = async () => {
  const spinner = ora('Checking for updates...')
  spinner.start()

  const npmrc = rc('npm', { registry: 'https://registry.npmjs.org/' })
  // fetch remote latest version
  const res = await exports.request(`${npmrc.registry}${pkg.name}/latest`)

  spinner.stop()

  const latest = res.body.version

  // istanbul ignore next
  if (semver.lt(pkg.version, latest)) {
    // console.log()
    // console.log(chalk.yellow(`  A newer version of ${pkg.name} is available.`))
    exports.boxen(
      `Update available ${chalk.red(pkg.version)} → ${chalk.green(latest)}\n` +
      `Please run ${chalk.cyan(`yarn global add ${pkg.name}`)} to update`
    )
  }
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
