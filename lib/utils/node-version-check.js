const chalk = require('chalk')
const semver = require('semver')

/**
 * Node version check
 * @param {Object} pkg package info
 */
module.exports = pkg => {
  if (semver.satisfies(process.version, pkg.engines.node)) return
  console.error(chalk.yellow(`You are using Node.js ${chalk.red(process.version)}, but this version of ${chalk.cyan(pkg.name)} requires Node.js ${chalk.green(pkg.engines.node)}.`))
  console.error(chalk.yellow('Please upgrade your Node.js version before this operation.'))
  // node version required
  process.exit(1)
}
