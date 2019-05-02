import { join } from 'path'
import { filesystem, print, prompt, strings, GluegunToolbox } from 'gluegun'
import download = require('download')
import tildify = require('tildify')

import { render } from '../helpers/template'

/**
 * Template name is local path
 * @param {string} template template name or uri
 */
const isLocalPath = (template: string): boolean => {
  return /^[./]|^[a-zA-Z]:/.test(template)
}

/**
 * Get template url
 * @param {string} template template name or uri
 */
const getTemplateUrl = (template: string): string => {
  // template is full url
  if (/^https?:/.test(template)) return template
  // short name `zce-templates` is official templates org
  template = template.includes('/') ? template : `zce-templates/${template}`
  // ectract branch
  const [repository, branch = 'master'] = template.split('#')
  // github archive link
  return `https://github.com/${repository}/archive/${branch}.zip`
}

/**
 * Confirm destination path
 * @param {string}  project project name
 */
const confirmDestination = async (dest: string): Promise<string> => {
  dest = filesystem.resolve(dest)

  const exists = filesystem.exists(dest)

  // not exists
  if (!exists) return dest

  // already exist file
  if (exists === 'file') throw new Error(`Cannot init ${dest}: File exists.`)

  // confirm
  const sure = await prompt.confirm(
    dest === '.'
      ? 'Generate project in current directory?'
      : 'Target directory already exists. Continue?'
  )

  // cancel
  if (!sure) throw new Error('You have to cancel the init task.')

  // empty dir
  const list = filesystem.list(dest) || []
  if (!list.length) return dest

  // choose
  const { choose } = await prompt.ask({
    type: 'select',
    name: 'choose',
    message: `Target directory is not empty. Pick an action:`,
    choices: ['Merge', 'Overwrite', 'Cancel']
  })

  // cancel
  if (choose === 'Cancel') throw new Error('You have to cancel the init task.')

  // overwrite
  if (choose === 'Overwrite') {
    filesystem.dir(dest, { empty: true })
  }

  return dest
}

/**
 * Resolve template from local or remote
 * TODO: template version
 * @param {string}  template template name or uri
 * @param {boolean} offline  offline mode
 */
const resolveTemplate = async (
  template: string,
  offline: boolean
): Promise<string> => {
  // return if local template
  if (isLocalPath(template)) return template

  // fetch remote template
  const templateUrl = getTemplateUrl(template)

  const cachePath = join(
    filesystem.homedir(),
    '.config/zce/creator/cache',
    strings.kebabCase(templateUrl)
  )

  // offline mode
  if (offline) {
    if (filesystem.exists(cachePath) === 'dir') {
      // found cached template
      print.info(`Use cached template from \`${tildify(cachePath)}\`.`)
      return cachePath
    }

    // notfound cached template
    print.info(`Template cache \`${tildify(cachePath)}\` not found.`)
  }

  // clear cache
  filesystem.remove(cachePath)

  const spinner = print.spin('Downloading template...')

  try {
    await download(templateUrl, cachePath, { extract: true, strip: 1 })
    spinner.succeed('Download complete.')
    return cachePath
  } catch (e) {
    spinner.fail('Download failed.')
    throw new Error(`Failed to fetch template \`${template}\`: ${e.message}.`)
  }
}

/**
 * Load template options
 * TODO:
 * - template validate
 * - docs tips
 * @param {string} src source path
 */
const loadTemplate = async (src: string): Promise<{}> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const options = require(src)

    if (Object.prototype.toString.call(options) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }

    return options
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = `This template is invalid: ${e.message}`
      throw e
    }

    // return default template options
    return {}
  }
}

/**
 * Ask Questions
 * @param {Object}  prompts prompts
 * @param {string}  dest    destination path
 * @param {boolean} save    save anwsers
 */
const promptQuestions = async (questions: [] | {} | undefined): Promise<{}> => {
  if (!questions) {
    questions = [{ type: 'input', name: 'name', message: 'Project name' }]
  }

  if (!(questions instanceof Array)) {
    questions = Object.keys(questions).map(key =>
      Object.assign({}, (questions as {})[key], { name: key })
    )
  }

  return await prompt.ask(questions)
}

/**
 * Generate files from template
 * @param {string} src source path
 * @param {string} dest destination path
 * @param {Object} answers answers
 * @param {Object} options template options
 */
const generateFiles = async (
  src: string,
  dest: string,
  answers: {},
  options: any
): Promise<{}> => {
  const metadata = Object.assign({}, options.metadata, answers)
  const files = filesystem
    .find(src, { matching: join(options.source || 'template', '**') })
    .map(item => {
      return filesystem.readAsync(item).then(content => {
        if (!content) return
        // ignore files that do not have interpolate
        // https://github.com/lodash/lodash/blob/master/.internal/reEvaluate.js
        // https://github.com/lodash/lodash/blob/master/template.js#L19
        if (
          !(
            /<%([\s\S]+?)%>/.test(content) ||
            /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/.test(content)
          )
        ) {
          return
        }
        content = render(content, metadata)
        // filesystem.write()
      })
    })
  return files
}

export default async (toolbox: GluegunToolbox): Promise<void> => {
  toolbox.creator = {
    confirmDestination,
    resolveTemplate,
    loadTemplate,
    promptQuestions,
    generateFiles
  }
}
