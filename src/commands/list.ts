import { http, GluegunToolbox } from 'gluegun'

const api = http.create({
  baseURL: 'https://api.github.com',
  params: {
    client_id: '0cb723972877555ffb54', // eslint-disable-line @typescript-eslint/camelcase
    client_secret: 'ad0638a75ee90bb86c8b551f5f42f3a044725f38' // eslint-disable-line @typescript-eslint/camelcase
  },
  timeout: 20000
})

module.exports = {
  name: 'list',
  alias: 'ls',
  description: 'list available official templates',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { colors, info, warning, error, success, spin } = toolbox.print

    const spinner = spin('Loading available list from remote...')

    const username = toolbox.parameters.first
    const isOffical = username === 'zce-templates'

    const response = await api.get(
      `/users/${username || 'zce-templates'}/repos`,
      { per_page: 100 } // eslint-disable-line @typescript-eslint/camelcase
    )

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
    const repos: any = response.data

    // no repos
    if (!repos || !repos.length) {
      return warning('No available templates.')
    }

    // output results

    // json output
    if (toolbox.parameters.options.json) {
      const json = JSON.stringify(
        repos.map(item => ({
          name: isOffical ? item.name : item.full_name,
          description: item.description
        }))
      )
      return info(json)
    }

    // short output
    if (toolbox.parameters.options.short) {
      return repos.forEach(item =>
        info(`→ ${isOffical ? item.name : item.full_name}`)
      )
    }

    // full output
    success(`Available ${isOffical ? 'official' : username}'s templates:`)
    repos.forEach(item =>
      info(
        ` ${colors.yellow('→')} ${colors.blue(
          username === 'zce-templates' ? item.name : item.full_name
        )} ${colors.gray('-')} ${item.description}`
      )
    )

    // send it back (for testing, mostly)
    return repos
  }
}
