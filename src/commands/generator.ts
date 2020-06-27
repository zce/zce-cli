import path from 'path'
import crypto from 'crypto'
import { file, http, prompt, logger, missingArgument, Command, Context } from '../core'

// #region template list
/**
 * Fetch user's repos
 * @param username GitHub username
 */
export const fetchRepos = async (username: string) => {
  const res = await http.request<Record<string, string>[]>(`https://api.github.com/users/${username}/repos`, {
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
 * @param ctx context
 */
export const showTemplates = async (ctx: Context) => {
  const spinner = logger.spin('Loading available list from remote...')
  spinner.start()
  const { username, json, short } = ctx.options as { username: string; json: boolean; short: boolean }

  try {
    const repos = await fetchRepos(username)
    spinner.stop()

    const isOfficial = username === 'zce-templates'

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

    logger.info(`👇  Available ${isOfficial ? 'official' : username}'s templates:`)
    logger.newline()

    const infos = repos.map(i => [
      logger.color`{yellow →} {blue ${isOfficial ? i.name : i.full_name}}`,
      i.description
    ] as [string, unknown])
    logger.table(infos, 32, 2)

  } catch (e) {
    spinner.fail(logger.color`😞  Failed to load list from remote: {red ${e.message}}.`)
  }
}
// #endregion

/**
 * Get template url
 * @param template template name or uri
 * @todo template download link config
 */
export const getTemplateUrl = (template: string) => {
  // full url
  if (/^https?:/.test(template)) return template
  // short name
  // `zce-templates` is official templates org
  template = template.includes('/') ? template : `zce-templates/${template}`
  // branch
  const temp = template.split('#')
  // github archive link
  return `https://github.com/${temp[0]}/archive/${temp[1] || 'master'}.zip`
}

/**
 * Confirm destination path.
 * @param project project name
 */
export const comfirm = async (project: string) => {
  const dest = path.resolve(project)

  const exists = await file.exists(dest)

  //  dist not exists
  if (!exists) return dest

  if (exists !== 'dir') throw new Error(`Cannot init ${project}: File exists.`)

  // empty dir
  if (await file.isEmpty(dest)) return dest

  // clear console
  logger.clear()

  // confirm
  const { sure } = await prompt.ask({
    type: 'confirm',
    name: 'sure',
    initial: false,
    message: dest === process.cwd()
      ? 'Generate project in current directory?'
      : 'Target directory already exists. Continue?'
  })

  // cancel task
  if (!sure) throw new Error('You have to cancel the init task.')

  // choose next
  const { choose } = await prompt.ask({
    type: 'select',
    name: 'choose',
    message: `Target directory is not empty. Pick an action:`,
    choices: [ 'Merge', 'Overwrite', 'Cancel' ]
  })

  // cancel task
  if (choose === 'Cancel') throw new Error('You have to cancel the init task.')

  // overwrite
  if (choose === 'Overwrite') {
    await file.remove(dest)
  }

  return dest
}

/**
 * Resolve template from local or remote
 * @param template template name or uri
 * @param offline  offline mode
 * @todo
 * - template version
 */
export const resolve = async (template: string, offline: boolean) => {
  // local template path
  if (/^[./]|^[a-zA-Z]:/.test(template)) {
    return path.resolve(template)
  }

  // fetch remote template
  const url = getTemplateUrl(template)

  // url hash
  const hash = crypto.createHash('md5').update(url).digest('hex')

  const cachePath = file.getDataPath('generator', hash)

  const cacheExists = await file.exists(cachePath) === 'dir'

  if (offline) {
    // offline mode
    if (cacheExists) {
      // found cached template
      logger.info(`🚆  Use cached template @ \`${logger.color.yellow(file.tildify(cachePath))}\`.`)
      return cachePath
    }

    logger.info(`😔  Template cache \`${logger.color.yellow(file.tildify(cachePath))}\` not found.`)
  }

  // clear cache
  cacheExists && await file.remove(cachePath)

  const spinner = logger.spin('Downloading template...')

  try {
    spinner.start()
    // download template zip
    const temp = await http.download(url)
    // extract template
    await file.extract(temp, { dir: cachePath })
    spinner.succeed('Download template complete.')
    return cachePath
  } catch (e) {
    spinner.fail('Download failed.')
    throw new Error(`Failed to fetch template "${template}": ${e.message}.`)
  }
}

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
    username: {
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
    '$ [bin] init <username>/<repo> [project]'
  ],
  action: async (ctx: Context) => {
    if (ctx.options.list) {
      return await showTemplates(ctx)
    }

    const { primary: template, secondary: project = '.' } = ctx
    const { offline } = ctx.options as { offline: boolean }

    // required arguments
    if (!template) {
      return missingArgument('template')
    }

    try {
      // confirm destination
      const dest = await comfirm(project)

      // resolve template
      const src = await resolve(template, offline)
    } catch (e) {
      logger.error(e)
    }
  }
}

export default command
