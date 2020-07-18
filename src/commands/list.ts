import { http, logger, Command } from '../core'

/**
 * Fetch user's repos
 * @param owner GitHub username or organization
 */
export const fetchRepos = async (owner: string): Promise<Array<Record<string, string>>> => {
  const res = await http.request<Array<Record<string, string>>>(`https://api.github.com/users/${owner}/repos`, {
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

const command: Command = {
  name: 'list',
  usage: 'list [owner]',
  description: 'list available official templates.',
  alias: 'ls',
  options: {
    json: {
      type: 'boolean',
      alias: 'j',
      default: false,
      description: 'json mode templates outputs'
    },
    short: {
      type: 'boolean',
      alias: 's',
      default: false,
      description: 'short mode templates outputs'
    }
  },
  action: async ({ primary: owner = 'zce-templates', options }) => {
    const { json, short } = options as { json: boolean, short: boolean }

    const spinner = logger.spin('Loading available list from remote...')
    spinner.start()

    try {
      const repos = await fetchRepos(owner)
      spinner.stop()

      const isOfficial = owner === 'zce-templates'

      // json output
      if (json) {
        return logger.info(JSON.stringify(repos.map(i => ({
          name: i.name,
          owner: (i.owner as unknown as { login: string }).login,
          description: i.description,
          updated: i.updated_at
        }))))
      }

      // short output
      if (short) {
        return repos.forEach(item => logger.info(`→ ${isOfficial ? item.name : item.full_name}`))
      }

      // full mode
      if (repos.length === 0) {
        return logger.info('😞  No available templates.')
      }

      logger.info(`👇  Available ${isOfficial ? 'official' : owner}'s templates:`)
      logger.newline()

      const infos: Array<[string, string]> = repos.map(i => [
        logger.color`{yellow →} {blue ${isOfficial ? i.name : i.full_name}}`,
        i.description
      ])
      logger.table(infos, 32, 2)
    } catch (e) {
      spinner.fail(logger.color`😞  Failed to load list from remote: {red ${e.message}}.`)
    }
  }
}

export default command
