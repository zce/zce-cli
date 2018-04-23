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
  const defaults = new Defaults(dest)

  // set prompt defaults
  for (const name in prompts) {
    const item = prompts[name]
    if ('default' in item) continue
    let def = defaults[name]
    // istanbul ignore if
    if (def === undefined) continue
    // istanbul ignore else
    if (typeof def === 'function') {
      def = def.bind(defaults)
    }
    item.default = def
  }

  // clear console
  logger.clear()
  logger.log('\n🍭  Press ^C at any time to quit.\n')

  const defaultPrompts = { name: { type: 'input', message: 'name' } }
  const questions = Object.keys(Object.assign(defaultPrompts, prompts))
    .map(key => Object.assign({}, prompts[key], { name: key }))

  const answers = await inquirer.prompt(questions)

  // save this answers
  await Defaults.save(answers)

  return answers
}
