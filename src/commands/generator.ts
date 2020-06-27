import { logger, http, missingArgument, Command, Context } from '../core'

/**
 * Fetch user's repos
 * @param username GitHub username
 */
const fetchRepos = async (username: string) => {
  const res = await http.request<Record<string, string>[]>(`https://api.github.com/users/${username}/repos`, {
    searchParams: {
      client_id: '0cb723972877555ffb54',
      client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38',
      per_page: 100
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

    if (!ctx.primary) {
      return missingArgument('template')
    }

    if (ctx.options.lang === 'en') {
      logger.success(`Hey! ${ctx.primary}~`)
    } else if (ctx.options.lang === 'zh') {
      logger.success(`嘿！${ctx.primary}~`)
    }

    if (ctx.options.debug) {
      logger.debug(ctx)
    }
  }
}

export default command
