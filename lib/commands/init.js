const path = require('path')

const rimraf = require('rimraf')

/**
 * Init command action
 */

const confirmDestination = (project, force) => {
  const dest = path.resolve(project)

  // not exists
  if (!await util.exists(dest)) return dest

  // force mode
  if (force) {
    await util.rimraf(dest)
    return dest
  }

  // already exist file
  if (await util.isFile(dest)) throw new Error(`Cannot init ${project}: File exists.`)

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
const resolveTemplate = require('./resolve')
const loadTemplate = require('./load')
const promptQuestions = require('./prompt')
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
  // const src = await resolveTemplate(template, offline)
  // const options = await loadTemplate(src)
  // const answers = await promptQuestions(options.prompts, dest, save)
  // const files = await generateFiles(src, dest, answers, options)

  // // remove to template plugin or complete
  // // // run `git init` in destination
  // // await util.execute('git init', dest)

  // completeExecute(options.complete, { dest, src, options, answers, files })
}
