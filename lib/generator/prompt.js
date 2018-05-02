const semver = require('semver')
const inquirer = require('inquirer')
const validateName = require('validate-npm-package-name')

const Defaults = require('./defaults')
const { logger } = require('../common')

const setNameValidate = item => {
  const customValidate = item.validate
  item.validate = input => {
    const result = validateName(input)
    if (!result.validForNewPackages) {
      // istanbul ignore next
      return `Sorry, ${(result.errors || []).concat(result.warnings || []).join(' and ')}.`
    }
    return typeof customValidate !== 'function' ? true : customValidate(input)
  }
}

const setVersionValidate = item => {
  const customValidate = item.validate
  item.validate = input => {
    const result = semver.valid(input)
    if (!result) {
      return `Sorry, The '${input}' is not a semantic version.`
    }
    return typeof customValidate !== 'function' ? true : customValidate(input)
  }
}

/**
 * Ask Questions
 * @param {Object}  prompts prompts
 * @param {String}  dest    destination path
 * @param {Boolean} save    save anwsers
 */
module.exports = async (prompts, dest, save = false) => {
  if (!(prompts && Object.keys(prompts).length)) {
    prompts = { name: { type: 'input', message: 'name' } }
  }

  // defaults
  const defaults = await Defaults.init(dest)

  // set prompt defaults
  for (const name in prompts) {
    const item = prompts[name]
    if ('default' in item) continue

    const def = defaults[name]
    if (def === undefined) continue

    item.default = typeof def === 'function'
      ? def.bind(defaults)
      : def
  }

  // set prompt validates
  for (const name in prompts) {
    if (name === 'name') {
      setNameValidate(prompts[name])
    } else if (name === 'version') {
      setVersionValidate(prompts[name])
    }
  }

  // clear console
  logger.clear()
  logger.log('\n🍭  Press ^C at any time to quit.\n')

  const questions = Object.keys(prompts).map(key => Object.assign({}, prompts[key], { name: key }))

  const answers = await inquirer.prompt(questions)

  // save this answers
  save && await Defaults.save(answers)

  return answers
}
