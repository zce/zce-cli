/**
 * https://github.com/soldair/node-gitconfiglocal
 * https://github.com/sindresorhus/git-remote-origin-url
 */

import path from 'path'
import _ from 'lodash'
import semver from 'semver'
import validateName from 'validate-npm-package-name'
import { file, http, system, config, logger, strings, ware, prompt, missingArgument, Command, Middleware, Questions, Answers } from '../core'

export interface TemplateOptions {
  name: string
  version?: string
  source?: string
  metadata?: Record<string, unknown>
  questions?: Questions
  filters?: Record<string, (answers: Answers) => boolean>
  helpers?: Record<string, unknown>
  plugin?: Middleware<GeneraterContext>
  complete?: Middleware<GeneraterContext>
}

export interface GeneraterContext {
  readonly template: string
  readonly project: string
  readonly offline: boolean
  url?: string
  src?: string
  dest?: string
  options?: TemplateOptions
  answers?: Answers
  files?: Record<string, Buffer>
}

/**
 * Get template url.
 * @param input template name or uri
 * @todo # or @
 * @example
 * 1. short name, e.g. 'nm'
 * 2. full name, e.g. 'zce/nm'
 * 3. with branch, e.g. 'zce/nm#next'
 * 4. full url, e.g. 'https://github.com/zce/nm/archive/master.zip'
 */
export const getTemplateUrl = async (input: string): Promise<string> => {
  if (/^https?:/.test(input)) return input

  input = input.includes('/') ? input : `zce-templates/${input}`
  input = input.includes('#') ? input : `${input}#master`
  const [owner, name, branch] = input.split(/\/|#/)

  // default registry
  // eslint-disable-next-line no-template-curly-in-string
  const defaultRegistry = 'https://github.com/${owner}/${name}/archive/${branch}.zip'
  const { registry = defaultRegistry } = await config.get<string>()

  return strings.render(registry, { owner, name, branch })
}

/**
 * Prompt validater.
 */
export const validater: Record<string, (input: string) => true | string> = {
  name: input => {
    const result = validateName(input)
    if (result.validForNewPackages) return true
    return result.errors?.join(', ') || ''
  },
  version: input => {
    const valid = semver.valid(input)
    if (valid) return true
    return `The '${input}' is not a semantic version.`
  }
}

const generater = ware<GeneraterContext>()

// confirm destination
generater.use(async (context, next) => {
  context.dest = path.resolve(context.project)

  const exists = await file.exists(context.dest)

  //  dist not exists
  if (!exists) return next()

  if (exists !== 'dir') throw new Error(`Cannot init ${context.project}: File exists.`)

  // empty dir
  if (await file.isEmpty(context.dest)) return next()

  // clear console
  logger.clear()

  // confirm
  const { sure } = await prompt({
    type: 'confirm',
    name: 'sure',
    initial: false,
    message: context.dest === process.cwd() ? 'Generate project in current directory?' : 'Target directory already exists. Continue?'
  })

  // cancel task
  if (!sure) throw new Error('You have to cancel the init task.')

  // choose next
  const { choose } = await prompt({
    type: 'select',
    name: 'choose',
    message: 'Target directory is not empty. Pick an action:',
    choices: ['Merge', 'Overwrite', 'Cancel']
  })

  // cancel task
  if (choose === 'Cancel') throw new Error('You have to cancel the init task.')

  // overwrite
  if (choose === 'Overwrite') {
    await file.remove(context.dest)
  }

  return next()
})

// resolve template
generater.use(async (context, next) => {
  // local template path
  if (/^[./]|^[a-zA-Z]:/.test(context.template)) {
    context.src = path.resolve(context.template)
    return next()
  }

  // fetch remote template
  context.url = await getTemplateUrl(context.template)

  // url hash
  const hash = strings.md5(context.url)

  // template cache path
  context.src = file.getDataPath('generator', hash)

  const exists = await file.isDirectory(context.src)

  if (context.offline) {
    // offline mode
    if (exists) {
      // found cached template
      logger.info(`🚆  Use cached template @ \`${logger.color.yellow(file.tildify(context.src))}\`.`)
      return next()
    }

    logger.info(`😔  Template cache \`${logger.color.yellow(file.tildify(context.src))}\` not found.`)
  }

  // clear cache
  exists && await file.remove(context.src)

  const spinner = logger.spin('Downloading template...')

  try {
    spinner.start()
    // download template zip
    const temp = await http.download(context.url)
    // extract template
    await file.extract(temp, context.src, 1)
    // clean up
    await file.remove(temp)
    spinner.succeed('Download template complete.')
    return next()
  } catch (e) {
    spinner.fail('Download failed.')
    throw new Error(`Failed to fetch template \`${context.template}\`: ${e.message}.`)
  }
})

// load template options
generater.use(async (context, next) => {
  try {
    context.options = require(context.src!) as TemplateOptions
    if (Object.prototype.toString.call(context.options) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }
    return next()
  } catch (e) {
    // TODO: template deps not found
    if (e.code !== 'MODULE_NOT_FOUND') {
      e.message = `This template is invalid: ${e.message}`
      throw e
    }
  }

  // return default template options
  context.options = { name: context.template }
  return next()
})

// apply plugin
generater.use(async (context, next) => {
  if (!context.options?.plugin) return next()
  return context.options.plugin(context, next)
})

// inquire questions
generater.use(async (context, next) => {
  if (!context.options) return next()

  // default questions
  if (!context.options.questions) {
    context.options.questions = { name: 'name', type: 'input', message: 'Project name' }
  }

  if (!Array.isArray(context.options.questions)) {
    context.options.questions = [context.options.questions]
  }

  // TODO: refactor defaults
  const npmrc = await config.npm()
  const yarnrc = await config.yarn()
  const gitconfig = await config.git()

  const username = async () => {
    return npmrc?.['init-author-name'] || yarnrc?.['init-author-name'] || gitconfig?.['user.name'] || await config.username()
  }
  const email = async () => {
    return npmrc?.['init-author-email'] || yarnrc?.['init-author-email'] || gitconfig?.['user.email']
  }
  const url = async () => {
    return npmrc?.['init-author-url'] || yarnrc?.['init-author-url'] || gitconfig?.['user.url']
  }
  // istanbul ignore next
  const n = await username() || await config.fullname()
  const e = await email()
  const u = await url()
  // istanbul ignore next
  const author = `${n}${e ? ` <${e}>` : ''}${u ? ` (${u})` : ''}`

  // questions defaults & validate
  await Promise.all(context.options.questions.map(async item => {
    switch (item.name) {
      case 'name':
        item.initial = item.initial || path.basename(context.dest!)
        item.validate = item.validate || validater.name
        break
      case 'version':
        item.validate = validater.version
        // istanbul ignore next
        item.initial = item.initial || npmrc?.['init-version'] || yarnrc?.['init-version'] || '0.1.0'
        break
      case 'username':
        // istanbul ignore next
        item.initial = item.initial || await username()
        break
      case 'fullname':
        // istanbul ignore next
        item.initial = item.initial || await config.fullname()
        break
      case 'email':
        // istanbul ignore next
        item.initial = item.initial || await email()
        break
      case 'url':
        // istanbul ignore next
        item.initial = item.initial || await url()
        break
      case 'author':
        // istanbul ignore next
        item.initial = item.initial || author
        break
      case 'license':
        // istanbul ignore next
        item.initial = item.initial || npmrc?.['init-license'] || yarnrc?.['init-license'] || 'MIT'
        break
    }
  }))

  context.answers = await prompt(context.options.questions)
  return next()
})

// prepare template files
generater.use(async (context, next) => {
  const cwd = path.join(context.src!, context.options?.source || 'template')
  let filenames = await file.glob('**/*', { dot: true, nodir: true, cwd })

  const filters = context.options?.filters
  if (filters) {
    const patterns = Object.keys(filters).filter(item => !filters[item](context.answers!))

    patterns.forEach(pattern => {
      const filter = file.minimatch.filter(pattern, { dot: true, matchBase: true })
      filenames = filenames.filter((...args) => !filter(...args))
    })
  }

  const files: Record<string, Buffer> = {}
  await Promise.all(filenames.map(item => {
    return file.readFile(path.join(cwd, item)).then(buffer => { files[item] = buffer })
  }))
  context.files = files

  await next()
})

// rename template files
generater.use(async (context, next) => {
  const files = context.files!

  Object.keys(files).forEach(original => {
    // // windows path
    // original = original.replace('\\', '\\\\')
    const current = strings.render(original, context.answers!)
    if (current === original) return
    // rename it
    files[current] = files[original]
    delete files[original]
  })

  await next()
})

// render template files
generater.use(async (context, next) => {
  const files = context.files!

  Object.keys(files).forEach(name => {
    const contents = files[name].toString()
    // ignore files that do not have interpolate
    // https://github.com/lodash/lodash/blob/master/.internal/reEvaluate.js
    // https://github.com/lodash/lodash/blob/master/template.js#L19
    if (!(/<%([\s\S]+?)%>/.test(contents) || /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/.test(contents))) {
      return
    }
    files[name] = Buffer.from(strings.render(contents, context.answers!, {
      imports: { _, ...context.options?.metadata, ...context.options?.helpers }
    }))
  })

  await next()
})

// write files
generater.use(async (context, next) => {
  const dest = context.dest!
  const files = context.files!

  await Promise.all(Object.keys(files).map(name => file.writeFile(path.join(dest, name), files[name])))

  await next()
})

// install deps
generater.use(async (context, next) => {
  const isYarn = Object.keys(context.files!).includes('yarn.lock')

  const spinner = logger.spin('Installing dependencies...')
  await system.exec(isYarn ? 'yarn' : 'npm', ['install'], { cwd: context.dest })
  spinner.succeed('Install completed.')

  await next()
})

// git init
generater.use(async (context, next) => {
  const spinner = logger.spin('Initializing Git repo...')
  await system.exec('git', ['init'], { cwd: context.dest })
  await system.exec('git', ['add', '--all'], { cwd: context.dest })
  await system.exec('git', ['commit', '-m', 'feat: initial commit'], { cwd: context.dest })
  spinner.succeed('Initial repo complete.')

  await next()
})

// execute complete
generater.use(async (context, next) => {
  if (context.options?.complete) { return context.options.complete(context, next) }
})

const command: Command = {
  name: 'init',
  usage: 'init <template> [project]',
  description: 'generate a new project from a template.',
  options: {
    offline: {
      type: 'boolean',
      alias: 'o',
      default: false,
      description: 'offline mode, use cached template'
    }
  },
  examples: [
    logger.color.gray('# create a new project with an official template'),
    '$ [bin] init <template> [project]',
    logger.color.gray('# create a new project straight from a github template'),
    '$ [bin] init <owner>/<repo> [project]'
  ],
  action: async ({ primary: template, secondary: project = '.', options }) => {
    const { offline } = options as { offline: boolean }

    // required arguments
    if (!template) {
      return missingArgument('template')
    }

    try {
      // begin
      await generater.run({ template, project, offline })
    } catch (e) {
      logger.error(e)
    }
  }
}

export default command
