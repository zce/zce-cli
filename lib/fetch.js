const os = require('os')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const rimraf = require('rimraf')
const download = require('download')
const util = require('./util')
const logger = require('./logger')
const { name, version, homepage } = require('../package')

const cacheRoot = path.join(os.homedir(), '.cache/zce')

const options = {
  extract: true,
  strip: 1,
  mode: '666',
  headers: {
    'accept': 'application/zip',
    'user-agent': `${name}/${version} (${homepage})`
  }
}

const spinner = ora('Downloading template...')

/**
 * Fetch template from remote or cache
 * @param  {String}  template Template name
 * @param  {Boolean} offline  Offline mode
 * @return {Promise}          Fetch promise
 */
module.exports = (template, offline) => {
  // TODO: template cache id
  const cachePath = path.join(cacheRoot, util.md5(template))
  const cacheExists = util.existsSync(cachePath)

  if (offline && cacheExists) {
    logger.log(`\n🚆  Use cached template @ ${chalk.yellow(util.tildify(cachePath))}`)
    return Promise.resolve(cachePath)
  } else if (offline) {
    logger.log(`\n😔  Template cache ${chalk.yellow(util.tildify(cachePath))} not found`)
  }

  logger.log() // padding
  spinner.start()
  cacheExists && rimraf.sync(cachePath)

  return download(util.getTemplateUrl(template), cachePath, options)
    .then(() => {
      spinner.succeed('Download complete.')
      return cachePath
    })
    .catch(err => {
      spinner.fail('Download failed.')
      throw new Error(`Failed to fetch template "${template}": ${err.message}`)
    })
}

Object.defineProperty(module.exports, 'cachePath', {
  get: () => cacheRoot
})
