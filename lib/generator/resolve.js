const os = require('os')
const path = require('path')

const ora = require('ora')
const chalk = require('chalk')
const rimraf = require('rimraf')

const { util, pkg } = require('../common')

/**
 * Template name is local path
 * @param {String} template template name or uri
 */
const isLocalPath = template => {
  return /^[./]|^[a-zA-Z]:/.test(template)
}

/**
 * Get template url
 * @param {String} template template name or uri
 */
const getTemplateUrl = template => {
  // full url
  if (/^https?:/.test(template)) return template
  // short name
  template = template.includes('/') ? template : `zce-templates/${template}`
  // branch
  const temp = template.split('#')
  // github archive link
  return `https://github.com/${temp[0]}/archive/${temp[1] || 'master'}.zip`
}

/**
 * Resolve template from local or remote
 * @param {String}  template template name or uri
 * @param {Boolean} offline  offline mode
 */
module.exports = async (template, offline) => {
  if (isLocalPath(template)) {
    // local template path
    return path.resolve(template)
  }

  // fetch remote template
  const templateUrl = getTemplateUrl(template)

  const cachePath = path.join(os.homedir(), '.cache', pkg.name, util.md5(templateUrl))
  const cacheExists = await util.existsDir(cachePath)

  if (offline) {
    // offline mode
    if (cacheExists) {
      // found cached template
      util.log(`🚆  Use cached template @ ${chalk.yellow(util.tildify(cachePath))}.`)
      return cachePath
    }

    util.log(`😔  Template cache ${chalk.yellow(util.tildify(cachePath))} not found.`)
  }

  // clear cache
  cacheExists && rimraf.sync(cachePath)

  const spinner = ora('Downloading template...')

  try {
    spinner.start()
    await util.download(templateUrl, cachePath, { extract: true, strip: 1, mode: 666 })
    spinner.succeed('Download complete.')
    return cachePath
  } catch (e) {
    spinner.fail('Download failed.')
    throw new Error(`Failed to fetch template "${template}": ${e.message}.`)
  }
}

// for unit test
module.exports.isLocalPath = isLocalPath
module.exports.getTemplateUrl = getTemplateUrl
