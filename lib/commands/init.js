const path = require('path')

const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')

const { http, logger, util } = require('../helpers')

/**
 * Confirm destination path
 * @param {string}  project project name
 * @param {boolean} force   overwrite force, default: false
 */
const confirmDestination = async (project = '.', force = false) => {
  const dest = path.resolve(project)

  // not exists
  if (!await util.exists(dest)) return dest

  // force mode
  if (force) {
    await util.rimraf(dest)
    return dest
  }

  // already exist file
  if (await util.isFile(dest)) {
    throw new Error(`Cannot init ${project}: File exists.`)
  }

  // clear console
  logger.clear()

  // confirm
  const { sure } = await inquirer.prompt({
    name: 'sure',
    type: 'confirm',
    default: false,
    message: dest === process.cwd()
      ? 'Generate project in current directory?'
      : 'Target directory already exists. Continue?'
  })

  // cancel
  if (!sure) throw new Error('You have to cancel the init task.')

  // empty dir
  if (await util.isEmpty(dest)) return dest

  // choose
  const { choose } = await inquirer.prompt({
    name: 'choose',
    type: 'list',
    message: `Target directory is not empty. Pick an action:`,
    choices: [
      { name: 'Merge', value: 'merge' },
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Cancel', value: 'cancel' }
    ]
  })

  // cancel
  if (choose === 'cancel') throw new Error('You have to cancel the init task.')

  // overwrite
  if (choose === 'overwrite') {
    await util.rimraf(dest)
  }

  return dest
}

/**
 * Get template url
 * @param {string} template template name or uri
 */
const getTemplateUrl = template => {
  // full url
  if (util.isRemoteUrl(template)) return template
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
 * @param {string}  template template name or uri
 * @param {boolean} offline  offline mode
 */
const resolveTemplate = async (template, offline) => {
  if (util.isLocalPath(template)) {
    // local template path
    return path.resolve(template)
  }

  // fetch remote template
  const templateUrl = getTemplateUrl(template)

  const cachePath = util.getDataPath('init', 'cache', templateUrl.replace(/[\W]+/g, '-'))

  const cacheExists = await util.exists(cachePath) && await util.isDirectory(cachePath)

  if (offline) {
    // offline mode
    if (cacheExists) {
      // found cached template
      logger.info(`Use cached template @ ${chalk.yellow(util.tildify(cachePath))}.`)
      return cachePath
    }

    logger.warn(`Template cache ${chalk.yellow(util.tildify(cachePath))} not found.`)
  }

  // clear cache
  cacheExists && await util.rimraf(cachePath)

  const spinner = ora('Downloading template...')
  spinner.start()

  try {
    await http.download(templateUrl, cachePath, { extract: true, strip: 1, mode: 666 })
    spinner.succeed('Download complete.')
    return cachePath
  } catch (e) {
    spinner.fail('Download failed.')
    throw new Error(`Failed to fetch template "${template}": ${e.message}.`)
  }
}

/**
 * Load template options
 * TODO:
 * - template validate
 * - docs tips
 * @param {string} src source path
 */
const loadTemplate = async src => {
  try {
    const options = require(src)

    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw new Error('template needs to expose an object.')
    }

    return options
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND' || e.message !== `Cannot find module '${src}'`) {
      throw new Error(`This template is invalid: ${e.message}`)
    }

    // return default template options
    return {}
  }
}

const defaults = {}

const validates = {}

/**
 * Ask Questions
 * @param {Object}  prompts prompts
 * @param {string}  dest    destination path
 * @param {boolean} save    save anwsers
 */
const promptQuestions = async (prompts, dest, save = false) => {
  if (!prompts || !Object.keys(prompts).length) {
    prompts = { name: { type: 'input', message: 'Project name' } }
  }

  // set prompt defaults
  for (const key in prompts) {
    if ('default' in prompts[key]) continue
    if (key in defaults) continue
    prompts[key].default = defaults[key]
  }

  // set prompt validates
  for (const key in prompts) {
    if ('validate' in prompts[key]) continue
    if (key in validates) continue
    prompts[key].validate = validates[key]
  }

  // clear console
  logger.clear()
  logger.info('Press ^C at any time to quit.')

  const questions = Object.keys(prompts).map(key => Object.assign({}, prompts[key], { name: key }))

  const answers = await inquirer.prompt(questions)

  // // save this answers
  // save && await Defaults.save(answers)

  return answers
}
const generateFiles = require('./generate')
const completeExecute = require('./complete')

/**
 * Generate a new project from a template
 * @param {string}  template        template name or uri
 * @param {string}  project         project destination
 * @param {Object}  options         options
 * @param {boolean} options.force   overwrite target directory if it exists
 * @param {boolean} options.offline use cached template
 * @param {boolean} options.save    save answers
 */
module.exports = async (template, project = '.', { force, offline, save } = {}) => {
  const dest = await confirmDestination(project, force)
  const src = await resolveTemplate(template, offline)
  const options = await loadTemplate(src)
  const answers = await promptQuestions(options.prompts, dest, save)
  const files = await generateFiles(src, dest, answers, options)

  // // remove to template plugin or complete
  // // // run `git init` in destination
  // // await util.execute('git init', dest)

  completeExecute(options.complete, { dest, src, options, answers, files })
}
