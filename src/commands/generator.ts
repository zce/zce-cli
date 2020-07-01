// import path from 'path'
// import crypto from 'crypto'
// import { file, http, config, prompt, logger, template, missingArgument, Command, Context, Questions, Answers } from '../core'

// // #region template list
// /**
//  * Fetch user's repos
//  * @param owner GitHub username or organization
//  */
// export const fetchRepos = async (owner: string) => {
//   const res = await http.request<Record<string, string>[]>(`https://api.github.com/users/${owner}/repos`, {
//     searchParams: {
//       client_id: '0cb723972877555ffb54',
//       client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
//       per_page: 100,
//       sort: 'updated'
//     },
//     timeout: 5 * 1000 // 5s
//   })
//   return res.body
// }

// /**
//  * List available templates
//  * @param ctx context
//  */
// export const showTemplates = async (ctx: Context) => {
//   const spinner = logger.spin('Loading available list from remote...')
//   spinner.start()
//   const { owner, json, short } = ctx.options as { owner: string; json: boolean; short: boolean }

//   try {
//     const repos = await fetchRepos(owner)
//     spinner.stop()

//     const isOfficial = owner === 'zce-templates'

//     // json output
//     if (json) {
//       return logger.info(JSON.stringify(repos))
//     }

//     // short output
//     if (short) {
//       return repos.forEach(item => logger.info(`→ ${isOfficial ? item.name : item.full_name}`))
//     }

//     // full mode
//     if (!repos.length) {
//       return logger.info('😞  No available templates.')
//     }

//     logger.info(`👇  Available ${isOfficial ? 'official' : owner}'s templates:`)
//     logger.newline()

//     const infos: [string, unknown][] = repos.map(i => [
//       logger.color`{yellow →} {blue ${isOfficial ? i.name : i.full_name}}`,
//       i.description
//     ])
//     logger.table(infos, 32, 2)
//   } catch (e) {
//     spinner.fail(logger.color`😞  Failed to load list from remote: {red ${e.message}}.`)
//   }
// }
// // #endregion

// export interface TemplateOptions {
//   name: string
//   version: string
//   source: string
//   metadata: Record<string, unknown>
//   questions: Questions
//   filters: Record<string, (answers: Answers) => boolean>
//   helpers: Record<string, unknown>
//   plugin: (context: Record<string, unknown>, next: ) => {}
//   complete: (context: Record<string, unknown>) => Promise<void | string> | string
// }

// /**
//  * Get template url.
//  * @param input template name or uri
//  * @todo template download link config
//  * @example
//  * 1. short name, e.g. 'nm'
//  * 2. full name, e.g. 'zce/nm'
//  * 3. with branch, e.g. 'zce/nm#next'
//  * 4. full url, e.g. 'https://github.com/zce/nm/archive/master.zip'
//  */
// export const getTemplateUrl = async (input: string): Promise<string> => {
//   if (/^https?:/.test(input)) return input

//   input = input.includes('/') ? input : `zce-templates/${input}`
//   input = input.includes('#') ? input : `${input}#master`
//   const [owner, name, branch] = input.split(/\/|#/)

//   // default registry
//   const defaultRegistry = 'https://github.com/${owner}/${name}/archive/${branch}.zip'
//   const { registry = defaultRegistry } = await config.get<string>()

//   return template.render(registry, { owner, name, branch })
// }

// /**
//  * Confirm destination path.
//  * @param project project name
//  */
// export const comfirm = async (project: string) => {
//   const dest = path.resolve(project)

//   const exists = await file.exists(dest)

//   //  dist not exists
//   if (!exists) return dest

//   if (exists !== 'dir') throw new Error(`Cannot init ${project}: File exists.`)

//   // empty dir
//   if (await file.isEmpty(dest)) return dest

//   // clear console
//   logger.clear()

//   // confirm
//   const { sure } = await prompt.ask({
//     type: 'confirm',
//     name: 'sure',
//     initial: false,
//     message:
//       dest === process.cwd() ? 'Generate project in current directory?' : 'Target directory already exists. Continue?'
//   })

//   // cancel task
//   if (!sure) throw new Error('You have to cancel the init task.')

//   // choose next
//   const { choose } = await prompt.ask({
//     type: 'select',
//     name: 'choose',
//     message: `Target directory is not empty. Pick an action:`,
//     choices: ['Merge', 'Overwrite', 'Cancel']
//   })

//   // cancel task
//   if (choose === 'Cancel') throw new Error('You have to cancel the init task.')

//   // overwrite
//   if (choose === 'Overwrite') {
//     await file.remove(dest)
//   }

//   return dest
// }

// /**
//  * Resolve template from local or remote.
//  * @param template template name or uri
//  * @param offline offline mode
//  * @todo
//  * - template version
//  */
// export const resolve = async (template: string, offline: boolean) => {
//   // local template path
//   if (/^[./]|^[a-zA-Z]:/.test(template)) {
//     return path.resolve(template)
//   }

//   // fetch remote template
//   const url = await getTemplateUrl(template)

//   // url hash
//   const hash = crypto.createHash('md5').update(url).digest('hex')

//   const cachePath = file.getDataPath('generator', hash)

//   const cacheExists = (await file.exists(cachePath)) === 'dir'

//   if (offline) {
//     // offline mode
//     if (cacheExists) {
//       // found cached template
//       logger.info(`🚆  Use cached template @ \`${logger.color.yellow(file.tildify(cachePath))}\`.`)
//       return cachePath
//     }

//     logger.info(`😔  Template cache \`${logger.color.yellow(file.tildify(cachePath))}\` not found.`)
//   }

//   // clear cache
//   cacheExists && (await file.remove(cachePath))

//   const spinner = logger.spin('Downloading template...')

//   try {
//     spinner.start()
//     // download template zip
//     const temp = await http.download(url)
//     // extract template
//     await file.extract(temp, cachePath, 1)
//     // clean up
//     await file.remove(temp)
//     spinner.succeed('Download template complete.')
//     return cachePath
//   } catch (e) {
//     spinner.fail('Download failed.')
//     throw new Error(`Failed to fetch template "${template}": ${e.message}.`)
//   }
// }

// /**
//  * Load template options.
//  * @param src source path
//  * @todo
//  * - template validate
//  * - docs tips
//  */
// export const load = async (src: string) => {
//   try {
//     const options = require(src)

//     if (Object.prototype.toString.call(options) !== '[object Object]') {
//       throw new TypeError('template needs to expose an object.')
//     }

//     return options
//   } catch (e) {
//     if (e.code !== 'MODULE_NOT_FOUND') {
//       e.message = `This template is invalid: ${e.message}`
//       throw e
//     }

//     // return default template options
//     return {}
//   }
// }

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
