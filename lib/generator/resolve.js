const path = require('path')

const chalk = require('chalk')
const rimraf = require('rimraf')

const { logger, http, util } = require('../common')

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
  // `zce-templates` is official templates org
  template = template.includes('/') ? template : `zce-templates/${template}`
  // branch
  const temp = template.split('#')
  // github archive link
  return `https://github.com/${temp[0]}/archive/${temp[1] || 'master'}.zip`
}

/**
 * Resolve template from local or remote
 * TODO: template version
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

  const cachePath = util.getDataPath('generator/cache', templateUrl.replace(/[\W]+/g, '-'))

  const cacheExists = await util.exists(cachePath) && await util.isDirectory(cachePath)

  if (offline) {
    // offline mode
    if (cacheExists) {
      // found cached template
      logger.log(`🚆  Use cached template @ ${chalk.yellow(util.tildify(cachePath))}.`)
      return cachePath
    }

    logger.log(`😔  Template cache ${chalk.yellow(util.tildify(cachePath))} not found.`)
  }

  // clear cache
  cacheExists && rimraf.sync(cachePath)

  const spinner = logger.ora('Downloading template...')

  try {
    spinner.start()
    await http.download(templateUrl, cachePath, { extract: true, strip: 1, mode: 666 })
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
