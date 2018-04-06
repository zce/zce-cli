/**
 * Init command action
 * https://github.com/sindresorhus/trash ???
 */

const os = require('os')
const fs = require('fs')
const path = require('path')

const ora = require('ora')
const chalk = require('chalk')
const rimraf = require('rimraf')
const inquirer = require('inquirer')
const minimatch = require('minimatch')
const Metalsmith = require('metalsmith')

const util = require('./util')
const template = require('./template')
const Defaults = require('./defaults')
const pkg = require('../../package')

/**
 * Confirm destination path
 * @param {String}  project project name
 * @param {Boolean} force   overwrite force, default: false
 */
const confirmDestination = async (project, force = false) => {
  const dest = path.resolve(project)

  // not exists
  if (!util.exists(dest)) return dest

  // exists
  if (force) {
    rimraf.sync(dest)
    return dest
  }

  // clear console
  util.clearConsole()

  // confirm
  const { sure } = await inquirer.prompt({
    name: 'sure',
    type: 'confirm',
    default: false,
    message: dest === process.cwd() ? 'Generate project in current directory?' : 'Target directory already exists. Continue?'
  })

  // cancel
  if (!sure) throw new Error('You have to cancel the init task.')

  // empty dir
  if (!fs.readdirSync(dest).length) return dest

  // choose
  const { choose } = await inquirer.prompt({
    name: 'choose',
    type: 'list',
    message: `Target directory is not empty. Pick an action:`,
    choices: [
      { name: 'Overwrite', value: 'overwrite' },
      { name: 'Merge', value: 'merge' },
      { name: 'Cancel', value: 'cancel' }
    ]
  })

  // cancel
  if (choose === 'cancel') throw new Error('You have to cancel the init task.')

  // overwrite
  if (choose === 'overwrite') {
    rimraf.sync(dest)
  }

  return dest
}

/**
 * Resolve template from local or remote
 * @param {String}  template template name or uri
 * @param {Boolean} offline  offline mode
 */
const resolveTemplate = async (template, offline) => {
  if (util.isLocalPath(template)) {
    // local template path
    return path.resolve(template)
  }

  // fetch remote template
  const templateUrl = util.getTemplateUrl(template)

  const cachePath = path.join(os.homedir(), '.cache', pkg.name, util.md5(templateUrl))
  const cacheExists = util.exists(cachePath)

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

/**
 * Load template options
 * TODO:
 * - template validate
 * - docs tips
 * @param {String} src source path
 */
const loadTemplate = async src => {
  try {
    return require(src)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e
    // throw new Error('This template is invalid.')
    return {}
  }
}

/**
 * Set prompts default
 * @param {Object} options template options
 * @param {String} dest    destination path
 */
const setPromptsDefault = async (options, dest) => {
  // defaults
  const defaults = await Defaults.init(dest)

  // set prompt defaults
  for (const key in options.prompts) {
    const item = options.prompts[key]
    if ('default' in item) continue
    const def = defaults.get(key)
    if (def === undefined) continue
    item.default = def
  }

  return options.prompts
}

/**
 * Ask Questions
 * @param {Object} prompts prompts
 */
const askQuestions = async prompts => {
  // clear console
  util.clearConsole()
  util.log('\n🍭  Press ^C at any time to quit.\n')

  const defaultPrompts = { name: { type: 'input', message: 'name' } }
  const questions = Object.keys(Object.assign(defaultPrompts, prompts))
    .map(key => Object.assign({}, prompts[key], { name: key }))

  return inquirer.prompt(questions)
}

/**
 * Generate files from template
 * @param {String} src source path
 * @param {String} dest destination path
 * @param {Object} answers answers
 * @param {Object} options template options
 */
const generate = (src, dest, answers, options) => new Promise((resolve, reject) => {
  const { source, metadata, filters, helpers, plugin } = options

  const metalsmith = Metalsmith(src)

  metalsmith.metadata(Object.assign(metadata, answers))

  // plugin
  typeof plugin === 'function' && metalsmith.use(plugin)

  // filter
  metalsmith.use((files, metalsmith, next) => {
    if (!filters) return next()
    const metadata = metalsmith.metadata()
    const filenames = Object.keys(files)
    Object.keys(filters)
      .filter(glob => !filters[glob](metadata))
      .forEach(glob => {
        const match = minimatch.filter(glob, { dot: true, matchBase: true })
        filenames.forEach(file => match(file) && delete files[file])
      })
    next()
  })

  // rename
  metalsmith.use((files, metalsmith, next) => {
    const metadata = metalsmith.metadata()
    const filenames = Object.keys(files)
    filenames.forEach(original => {
      // windows path
      original = original.replace('\\', '\\\\')
      const current = template.render(original, metadata)
      if (current === original) return
      files[current] = files[original]
      delete files[original]
    })
    next()
  })

  // render
  metalsmith.use((files, metalsmith, next) => {
    const metadata = metalsmith.metadata()
    for (const item in files) {
      let contents = files[item].contents.toString()
      contents = template.render(contents, metadata)
      files[item].contents = Buffer.from(contents)
    }
    next()
  })

  metalsmith.source(source || 'template')
  metalsmith.destination(dest)
  metalsmith.clean(false)

  metalsmith.build((err, files) => {
    if (err) return reject(err)
    util.log(`\n🎉  "${answers.name}" generated into ${chalk.yellow(util.tildify(dest))}`)
    resolve(files)
  })
})

/**
 * Generate a new project from a template
 * @param {String}  template        template name or uri
 * @param {String}  project         project destination
 * @param {Object}  options         options
 * @param {Boolean} options.force   overwrite target directory if it exists
 * @param {Boolean} options.offline use cached template
 */
module.exports = async (template, project = '.', { force, offline }) => {
  const dest = await confirmDestination(project, force)
  const src = await resolveTemplate(template, offline)
  const options = await loadTemplate(src)
  const prompts = await setPromptsDefault(options, dest)
  const answers = await askQuestions(prompts)
  const files = await generate(src, dest, answers, options)

  // complete
  if (typeof options.complete === 'function') {
    options.complete(answers, src, dest)
  } else if (typeof options.complete === 'string') {
    util.log() // padding
    util.log(template.render(options.complete, answers))
    util.log()
  }
}
