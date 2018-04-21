/**
 * Init command action
 * https://github.com/sindresorhus/trash ???
 */

const confirmDestination = require('./confirm')
const resolveTemplate = require('./resolve')
const loadTemplate = require('./load')
const promptQuestions = require('./prompt')
const generateFiles = require('./generate')
const complete = require('./complete')

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
  const answers = await promptQuestions(options.prompts, dest)
  const files = await generateFiles(src, dest, answers, options)

  complete(options.complete, { dest, src, options, answers, files })
}
