/**
 * Utils
 */

const chalk = require('chalk')
const semver = require('semver')

const pkg = require('../package')

/**
 *
 */
exports.checkNodeVersion = () => {
  if (semver.satisfies(process.version, pkg.engines.node)) {
    return true
  }
  console.log(chalk.red(`You are using Node.js ${process.version}, but this version of ${pkg.name} requires Node.js ${pkg.engines.node}.`))
  console.log(chalk.red('Please upgrade your Node.js version before this operation.'))
  process.exit(1)
}
