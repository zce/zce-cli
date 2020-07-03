import path from 'path'
import { file, http, config, logger, strings, ware, prompt, missingArgument, Command, Questions, Answers } from '../core'
import { Middleware } from '../core/types'

// #region template list
/**
 * Fetch user's repos
 * @param owner GitHub username or organization
 */
export const fetchRepos = async (owner: string): Promise<Record<string, string>[]> => {
  const res = await http.request<Record<string, string>[]>(`https://api.github.com/users/${owner}/repos`, {
    searchParams: {
      client_id: '0cb723972877555ffb54',
      client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
      per_page: 100,
      sort: 'updated'
    },
    timeout: 5 * 1000 // 5s
  })
  return res.body
}

/**
 * List available templates
 * @param options options
 */
export const showTemplates = async (owner: string, json: boolean, short: boolean): Promise<void> => {
  const spinner = logger.spin('Loading available list from remote...')
  spinner.start()

  try {
    const repos = await fetchRepos(owner)
    spinner.stop()

    const isOfficial = owner === 'zce-templates'

    // json output
    if (json) {
      return logger.info(JSON.stringify(repos))
    }

    // short output
    if (short) {
      return repos.forEach(item => logger.info(`→ ${isOfficial ? item.name : item.full_name}`))
    }

    // full mode
    if (!repos.length) {
      return logger.info('😞  No available templates.')
    }

    logger.info(`👇  Available ${isOfficial ? 'official' : owner}'s templates:`)
    logger.newline()

    const infos: [string, unknown][] = repos.map(i => [
      logger.color`{yellow →} {blue ${isOfficial ? i.name : i.full_name}}`,
      i.description
    ])
    logger.table(infos, 32, 2)
  } catch (e) {
    spinner.fail(logger.color`😞  Failed to load list from remote: {red ${e.message}}.`)
  }
}
// #endregion

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

interface GeneraterContext {
  readonly template: string
  readonly project: string
  readonly offline: boolean
  url?: string
  src?: string
  dest?: string
  options?: TemplateOptions
  answers?: Answers
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
  if (context.src) {
    try {
      context.options = require(context.src) as TemplateOptions
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

  // questions defaults & validate
  // context.options.questions.forEach(item => {

  // })

  context.answers = await prompt(context.options.questions)
  return next()
})

// generate files
generater.use(async (context, next) => {
  console.log(context)
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
    },
    list: {
      type: 'boolean',
      alias: 'ls',
      default: false,
      description: 'list available templates'
    },
    owner: {
      type: 'string',
      default: 'zce-templates',
      description: 'github user or organization slug'
    },
    json: {
      type: 'boolean',
      default: false,
      description: 'json mode templates outputs'
    },
    short: {
      type: 'boolean',
      default: false,
      description: 'short mode templates outputs'
    }
  },
  examples: [
    logger.color.gray('# create a new project with an official template'),
    '$ [bin] init <template> [project]',
    logger.color.gray('# create a new project straight from a github template'),
    '$ [bin] init <owner>/<repo> [project]'
  ],
  action: async ({ primary: template, secondary: project = '.', options }) => {
    type Options = { owner: string, json: boolean, short: boolean, offline: boolean }
    const { owner, json, short, offline } = options as Options

    if (options.list) {
      return await showTemplates(owner, json, short)
    }

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

// /**
//  * Inquire questions.
//  * @param prompts prompts
//  * @param dest destination path
//  */
// export const inquire = async (prompts: Question, dest: string) => {
//   return await prompt.ask(prompts)
//   // if (!(prompts && Object.keys(prompts).length)) {
//   //   prompts = { name: { type: 'input', message: 'name' } }
//   // }

//   // // defaults
//   // const defaults = await Defaults.init(dest)

//   // // set prompt defaults
//   // for (const name in prompts) {
//   //   const item = prompts[name]
//   //   if ('default' in item) continue

//   //   const def = defaults[name]
//   //   if (def === undefined) continue

//   //   item.default = typeof def === 'function'
//   //     ? def.bind(defaults)
//   //     : def
//   // }

//   // // set prompt validates
//   // for (const name in prompts) {
//   //   if (name === 'name') {
//   //     setNameValidate(prompts[name])
//   //   } else if (name === 'version') {
//   //     setVersionValidate(prompts[name])
//   //   }
//   // }

//   // // clear console
//   // logger.clear()
//   // logger.log('\n🍭  Press ^C at any time to quit.\n')

//   // const questions = Object.keys(prompts).map(key => Object.assign({}, prompts[key], { name: key }))

//   // const answers = await prompt.ask(questions)

//   // return answers
// }

// /**
//  * Generate files from template.
//  * @param src source path
//  * @param dest destination path
//  * @param answers answers
//  * @param options template options
//  */
// export const generate = async (
//   src: string,
//   dest: string,
//   answers: Record<string, unknown>,
//   options: Record<string, unknown>
// ) => {}
// /**
//  * Execute template complete .
//  * @param complete template complete callback
//  * @param context generator context
//  */
// export const complete = async (options: Record<string, unknown>, context: Record<string, unknown>) => {}

// const command: Command = {
//   name: 'init',
//   usage: 'init <template> [project]',
//   description: 'generate a new project from a template.',
//   options: {
//     offline: {
//       type: 'boolean',
//       alias: 'o',
//       default: false,
//       description: 'offline mode, use cached template'
//     },
//     list: {
//       type: 'boolean',
//       alias: 'ls',
//       default: false,
//       description: 'list available templates'
//     },
//     owner: {
//       type: 'string',
//       default: 'zce-templates',
//       description: 'github user or organization slug'
//     },
//     json: {
//       type: 'boolean',
//       default: false,
//       description: 'json mode templates outputs'
//     },
//     short: {
//       type: 'boolean',
//       default: false,
//       description: 'short mode templates outputs'
//     }
//   },
//   examples: [
//     logger.color.gray('# create a new project with an official template'),
//     '$ [bin] init <template> [project]',
//     logger.color.gray('# create a new project straight from a github template'),
//     '$ [bin] init <owner>/<repo> [project]'
//   ],
//   action: async (ctx: Context) => {
//     if (ctx.options.list) {
//       return await showTemplates(ctx)
//     }

//     const { primary: template, secondary: project = '.' } = ctx
//     const { offline } = ctx.options as { offline: boolean }

//     // required arguments
//     if (!template) {
//       return missingArgument('template')
//     }

//     try {
//       // confirm destination
//       const dest = await comfirm(project)

//       // resolve template
//       const src = await resolve(template, offline)

//       // load template options
//       const options = await load(src) // Types

//       // inquire questions
//       const answers = (await inquire(options.prompts, dest)) as Record<string, unknown>

//       // generate files
//       const files = await generate(src, dest, answers, options)

//       // execute complete
//       // await complete({ src, dest, answers, files, options })
//     } catch (e) {
//       logger.error(e)
//     }
//   }
// }

// export default command
