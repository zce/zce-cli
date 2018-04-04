/**
 * Utils
 */

const rc = require('rc')
const ora = require('ora')
const got = require('got')
const chalk = require('chalk')
const semver = require('semver')

const pkg = require('../../package')

const logger = require('./logger')

/**
 * npmrc
 */
exports.npmrc = rc('npm', {
  'init-author-name': 'zce',
  'init-author-email': 'w@zce.me',
  'init-author-url': 'https://zce.me',
  'init-version': '0.1.0',
  'init-license': 'MIT',
  'registry': 'https://registry.npmjs.org/'
})

/**
 * node version check
 */
exports.nodeVersionCheck = async () => {
  // check node version
  if (semver.satisfies(process.version, pkg.engines.node)) {
    return true
  }

  logger.log()
  logger.error(`You are using Node.js ${process.version}, but this version of ${pkg.name} requires Node.js ${pkg.engines.node}.`)
  logger.error('Please upgrade your Node.js version before this operation.')
  logger.log()

  process.exit(1)
}

/**
 * Update check
 */
exports.updateCheck = async () => {
  const spinner = ora('Checking for updates...')
  spinner.start()

  // fetch remote latest version
  const res = await exports.got(`${exports.npmrc.registry}${pkg.name}`, { timeout: 1000, json: true })

  spinner.stop()

  const latest = res.body['dist-tags'].latest
  if (semver.lt(pkg.version, latest)) {
    // logger.log()
    // logger.log(chalk.yellow(`  A newer version of ${pkg.name} is available.`))
    logger.boxen(
      `Update available ${chalk.red(pkg.version)} → ${chalk.green(latest)}\n` +
      `Please run ${chalk.cyan(`yarn global add ${pkg.name}`)} to update`
    )
  }
}

/**
 * HTTP request
 * @param {String} url url
 * @param {Object} options options
 */
exports.got = async (url, options) => {
  // set default ua
  options.headers = Object.assign({
    'user-agent': `${pkg.name}/${pkg.version} (${pkg.homepage})`
  }, options.headers)

  options.timeout = options.timeout || 1000

  return got(url, options)
}

/**
 * Logger
 */
exports.logger = logger
