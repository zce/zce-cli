const rc = require('rc')
const ora = require('ora')
const chalk = require('chalk')
const semver = require('semver')

const http = require('./http')
const logger = require('./logger')
const pkg = require('../../package')

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
  const res = await http.request(`${npmrc.registry}${pkg.name}/latest`)

  spinner.stop()

  const latest = res.body.version

  // istanbul ignore next
  if (semver.lt(pkg.version, latest)) {
    // console.log()
    // console.log(chalk.yellow(`  A newer version of ${pkg.name} is available.`))
    logger.boxen(
      `Update available ${chalk.red(pkg.version)} → ${chalk.green(latest)}\n` +
      `Please run ${chalk.cyan(`yarn global add ${pkg.name}`)} to update`
    )
  }
}

// #endregion
