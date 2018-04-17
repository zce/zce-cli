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

/**
 * Update check
 */
exports.updateCheck = async () => {
  const spinner = ora('Checking for updates...')
  spinner.start()

  const npmrc = rc('npm', { registry: 'https://registry.npmjs.org/' })
  // fetch remote latest version
  const res = await exports.got(`${npmrc.registry}${pkg.name}/latest`)

  spinner.stop()

  const latest = res.body.version
  if (semver.lt(pkg.version, latest)) {
    // exports.log()
    // exports.log(chalk.yellow(`  A newer version of ${pkg.name} is available.`))
    exports.boxen(
      `Update available ${chalk.red(pkg.version)} → ${chalk.green(latest)}\n` +
      `Please run ${chalk.cyan(`yarn global add ${pkg.name}`)} to update`
    )
  }
}

/**
 * HTTP request
 * @param {String} url     url
 * @param {Object} options options
 */
exports.got = async (url, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({
    'user-agent': `${pkg.name}/${pkg.version} (${pkg.homepage})`
  }, options.headers)

  options.timeout = options.timeout || 5000
  options.json = options.json || true

  return got(url, options)
}

/**
 * HTTP download
 * @param {String} url     url
 * @param {String} dest    destination
 * @param {Object} options options
 */
exports.download = async (url, dest, options = {}) => {
  // set default ua
  options.headers = Object.assign({
    'user-agent': `${pkg.name}/${pkg.version} (${pkg.homepage})`
  }, options.headers)

  return download(url, dest, options)
}

/**
 * dir exists
 * @param {String} dir dir path
 */
exports.exists = dir => {
  try {
    return fs.statSync(dir).isDirectory()
  } catch (e) {
    return false
  }
}

/**
 * Tildify input path.
 */
exports.tildify = input => {
  input = path.normalize(input)
  const homedir = os.homedir()
  return input.includes(homedir) ? input.replace(homedir, '~') : input
}

/**
 * Untildify input path.
 */
exports.untildify = input => {
  input = path.normalize(input)
  const homedir = os.homedir()
  return input.includes('~') ? input.replace('~', homedir) : input
}

/**
 * Encrypt the input string to MD5
 */
exports.md5 = input => {
  return crypto.createHash('md5').update(input).digest('hex')
}

exports.log = (...args) => {
  console.log(...args)
}

exports.boxen = message => {
  const styles = { padding: 1, margin: 1, borderColor: 'yellow', borderStyle: 'round', dimBorder: false }
  console.log(boxen(message, styles))
}

exports.success = message => {
  console.log(symbols.success, message)
}

exports.error = message => {
  console.error(symbols.error, message)
}

exports.warn = message => {
  console.warn(symbols.warning, message)
}

exports.info = message => {
  console.info(symbols.info, message)
}

exports.clearConsole = title => {
  if (!process.stdout.isTTY) return
  const blank = '\n'.repeat(process.stdout.rows)
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  title && console.log(title)
}
