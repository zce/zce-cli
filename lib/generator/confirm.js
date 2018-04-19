const path = require('path')

const rimraf = require('rimraf')
const inquirer = require('inquirer')

const { logger, util } = require('../common')

/**
 * Confirm destination path
 * @param {String}  project project name
 * @param {Boolean} force   overwrite force, default: false
 */
module.exports = async (project = '.', force = false) => {
  const dest = path.resolve(project)

  // not exists
  if (!await util.existsDir(dest)) return dest

  // exists
  if (force) {
    rimraf.sync(dest)
    return dest
  }

  // clear console
  logger.clearConsole()

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
  if (await util.isEmptyDir(dest)) return dest

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
