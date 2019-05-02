import { http, GluegunCommand, GluegunToolbox } from 'gluegun'
import { HelpMessage } from '../types'

const description = 'List available official templates'

const helpMessage: HelpMessage = {
  description,
  usage: 'zce list [username]',
  options: {
    '-j, --json': 'Enable json mode output',
    '-s, --short': 'enable short mode output'
  }
}

const api = http.create({
  baseURL: 'https://api.github.com',
  params: {
    client_id: '0cb723972877555ffb54', // eslint-disable-line @typescript-eslint/camelcase
    client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38' // eslint-disable-line @typescript-eslint/camelcase
  },
  timeout: 10000
})

type RepoList = [{ name: string; full_name: string; description: string }]

const command: GluegunCommand = {
  name: 'list',
  alias: 'ls',
  description,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    if (toolbox.parameters.options.help || toolbox.parameters.options.h) {
      return toolbox.help(helpMessage)
    }

    const { colors, info, warning, error, success, spin } = toolbox.print

    const spinner = spin('Loading available list from remote...')

    const username = toolbox.parameters.first || 'zce-templates'
    const isOffical = username === 'zce-templates'

    const response = await api.get(`/users/${username}/repos`, {
      per_page: 100 // eslint-disable-line @typescript-eslint/camelcase
    })

    spinner.stop()

    // not found
    if (!response.ok && response.status === 404) {
      return error(`Username does not exist: \`${username}\`.`)
    }

    // other errors
    if (!response.ok) {
      return error(`Failed to load list from remote: \`${response.problem}\`.`)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const repos = response.data as RepoList

    // no repos
    if (!repos || !repos.length) {
      return warning('No available templates.')
    }

    // output results

    // json output
    if (toolbox.parameters.options.json || toolbox.parameters.options.j) {
      const result = JSON.stringify(
        repos.map(item => ({
          name: isOffical ? item.name : item.full_name,
          description: item.description
        }))
      )
      return info(result)
    }

    // short output
    if (toolbox.parameters.options.short || toolbox.parameters.options.s) {
      const result = repos.map(
        item => `→ ${isOffical ? item.name : item.full_name}`
      )
      return info(result.join('\n'))
    }

    // full output
    success(`Available ${isOffical ? 'official' : username}'s templates:`)
    const result = repos.map(
      item =>
        ` ${colors.yellow('→')} ${colors.blue(
          isOffical ? item.name : item.full_name
        )} ${colors.gray('-')} ${item.description}`
    )
    info(result.join('\n'))
  }
}

export default command
