const inquirer = require('inquirer')

const Defaults = require('./defaults')
const { logger } = require('../common')

/**
 * Ask Questions
 * @param {Object} prompts prompts
 * @param {String} dest    destination path
 */
module.exports = async (prompts, dest) => {
  // defaults
  const defaults = await Defaults.init(dest)

  // set prompt defaults
  for (const key in prompts) {
    const item = prompts[key]
    if ('default' in item) continue
    const def = defaults.get(key)
    if (def === undefined) continue
    item.default = def
  }

  // clear console
  logger.clearConsole()
  logger.log('\n🍭  Press ^C at any time to quit.\n')

  const defaultPrompts = { name: { type: 'input', message: 'name' } }
  const questions = Object.keys(Object.assign(defaultPrompts, prompts))
    .map(key => Object.assign({}, prompts[key], { name: key }))

  return inquirer.prompt(questions)
}
