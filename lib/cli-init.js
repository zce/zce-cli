const path = require('path')
const inquirer = require('inquirer')
const util = require('../lib/util')
const fetch = require('../lib/fetch')
const logger = require('../lib/logger')
const prompt = require('../lib/prompt')
const defaults = require('../lib/defaults')
const generate = require('../lib/generate')
const template = require('../lib/template')

/**
 * 1. Confirm destination path exists
 *
 * @uses
 *   - context.dest    - Destination path
 *   - context.inPlace - Destination path in place
 * @mounts
 *   - context.exists  - Destination path exists
 */
const confirmExists = context => {
  const { dest, inPlace } = context

  context.exists = util.existsSync(dest)

  if (!context.exists) return context

  logger.log() // padding

  const questions = {
    name: 'ok',
    type: 'confirm',
    default: false,
    message: inPlace
      ? 'Generate project in current directory?'
      : 'Target directory exists. Continue?'
  }
  // prompt when dest exist
  return inquirer.prompt(questions).then(answers => {
    if (!answers.ok) throw new Error('You have to cancel the init task.')
    return context
  })
}

/**
 * 2. Resolve template path from local or remote
 *
 * @uses
 *   - context.template - Template name
 *   - context.offline  - Offline mode
 * @mounts
 *   - context.src - Template path
 */
const resolveTemplate = context => {
  const { template, offline } = context

  if (util.isLocalPath(template)) {
    // local
    context.src = path.resolve(template)
    return context
  }

  // remote
  return fetch(template, offline).then(source => {
    context.src = source
    return context
  })
}

/**
 * 3. Load template options
 *
 * @uses
 *   - context.src     - Template path
 * @mounts
 *   - context.options - Template options
 */
const loadTemplate = context => {
  const { src } = context

  try {
    context.options = require(src)
  } catch (e) {
    // TODO: template validate && docs tips
    if (e.code !== 'MODULE_NOT_FOUND') throw e
    // throw new Error('This template is invalid.')
    context.options = {}
  }

  return context
}

/**
 * 4. Ask Questions
 *
 * @uses
 *   - context.dest    - Destination path
 *   - context.name    - Default name
 *   - context.exists  - Destination path exists
 *   - context.options - Template options
 * @mounts
 *   - context.answers - User answers
 */
const askQuestions = context => {
  const { dest, name, exists, options } = context
  const { prompts } = options

  logger.log('\n🍭  Press ^C at any time to quit.\n')

  // TODO: params
  return prompt(prompts, defaults(dest, exists, name)).then(answers => {
    context.answers = answers
    return context
  })
}

/**
 * 5. Generate files from template
 *
 * @uses
 *   - context.src     - Template path
 *   - context.dest    - Destination path
 *   - context.answers - User answers
 *   - context.options - Template options
 * @mounts
 *   - context.files   - Generated files
 */
const generateFiles = context => {
  const { src, dest, answers, options } = context
  return generate(src, dest, answers, options)
    .then(files => {
      context.files = files
      return context
    })
}

/**
 * 6. Response message to console
 *
 * @uses
 *   - context.options - Template options
 *   - context.answers - User answers
 */
const responseConsole = context => {
  const { options } = context
  const { complete } = options

  if (typeof complete === 'function') {
    logger.log() // padding
    complete(context)
  } else if (typeof complete === 'string') {
    logger.log() // padding
    logger.log(template.render(complete, context))
  }

  logger.log() // padding
  return context
}

/**
 * Error handler
 */
const onError = err => {
  logger.fatal(`\n💀  ${err.message}`, err)
}

/**
 * Initial command
 * @param  {String}  template Template name
 * @param  {String}  target   Target name
 * @param  {Boolean} offline  Offline mode
 * @return {Promise}          Initial promise
 */
module.exports = (template, target, offline) => {
  const dest = path.resolve(target || '.')
  const inPlace = dest === process.cwd()
  const name = path.basename(dest)

  const context = { template, dest, inPlace, name, offline }

  return Promise.resolve(context)
    .then(confirmExists)
    .then(resolveTemplate)
    .then(loadTemplate)
    .then(askQuestions)
    .then(generateFiles)
    .then(responseConsole)
    .catch(onError)
}
