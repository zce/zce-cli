const confirmDestination = require('./confirm-destination')
const resolveTemplate = require('./resolve-template')
const loadTemplate = require('./load-template')
const promptQuestions = require('./prompt-questions')
const generateFiles = require('./generate-files')
const completeExecute = require('./complete-execute')

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
