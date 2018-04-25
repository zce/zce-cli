/**
 * Init command action
 */

const confirmDestination = require('./confirm')
const resolveTemplate = require('./resolve')
const loadTemplate = require('./load')
const promptQuestions = require('./prompt')
const generateFiles = require('./generate')
const completeExecute = require('./complete')

/**
 * Generate a new project from a template
 * @param {String}  template        template name or uri
 * @param {String}  project         project destination
 * @param {Object}  options         options
 * @param {Boolean} options.force   overwrite target directory if it exists
 * @param {Boolean} options.offline use cached template
 * @param {Boolean} options.save    save answers
 */
module.exports = async (template, project = '.', { force, offline, save } = {}) => {
  const dest = await confirmDestination(project, force)
  const src = await resolveTemplate(template, offline)
  const options = await loadTemplate(src)
  const answers = await promptQuestions(options.prompts, dest, save)
  const files = await generateFiles(src, dest, answers, options)

  // remove to template plugin or complete
  // // run `git init` in destination
  // await util.execute('git init', dest)

  completeExecute(options.complete, { dest, src, options, answers, files })
}
