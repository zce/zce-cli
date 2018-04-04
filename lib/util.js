/**
 * Utils
 */

const rc = require('rc')
const ora = require('ora')
const got = require('got')
const chalk = require('chalk')
const semver = require('semver')

const pkg = require('../package')

exports.npmrc = rc('npm', {
  'init-author-name': 'zce',
  'init-author-email': 'w@zce.me',
  'init-author-url': 'https://zce.me',
  'init-version': '0.1.0',
  'init-license': 'MIT',
  'registry': 'https://registry.npmjs.org/'
})

/**
 * check version
 */
exports.checkVersion = async () => {
  // check node version
  if (!semver.satisfies(process.version, pkg.engines.node)) {
    console.log(chalk.red(`You are using Node.js ${process.version}, but this version of ${pkg.name} requires Node.js ${pkg.engines.node}.`))
    console.log(chalk.red('Please upgrade your Node.js version before this operation.'))
    process.exit(1)
  }

  const spinner = ora('Checking for updates...')
  spinner.start()

  // fetch remote latest version
  const res = await exports.got(`${exports.npmrc.registry}${pkg.name}`, { timeout: 1000, json: true })

  spinner.stop()

  const latest = res.body['dist-tags'].latest
  if (semver.lt(pkg.version, latest)) {
    console.log()
    console.log(chalk.yellow(`  A newer version of ${pkg.name} is available.`))
    console.log()
    console.log('  latest:    ' + chalk.green(latest))
    console.log('  installed: ' + chalk.red(pkg.version))
    console.log()
    process.exit(1)
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

  return got(url, options)
}
