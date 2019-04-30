import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'list',
  alias: 'ls',
  description: 'list available official templates',
  run: async (toolbox: GluegunToolbox) => {
    const { colors, info, warning, error, success, spin } = toolbox.print

    const spinner = spin('Loading available list from remote...')

    const username = toolbox.parameters.first

    const response = await toolbox.request(
      `/users/${username || 'zce-templates'}/repos`,
      { per_page: 100 }
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

    // no repos
    if (!response.data || !response.data.length) {
      return warning('No available templates.')
    }

    // output results
    const isOffical = username === 'zce-templates'

    // json output
    if (toolbox.parameters.options.json) {
      const json = JSON.stringify(
        response.data.map(item => ({
          name: isOffical ? item.name : item.full_name,
          description: item.description
        }))
      )
      return info(json)
    }

    // short output
    if (toolbox.parameters.options.short) {
      return response.data.forEach(item =>
        info(`→ ${isOffical ? item.name : item.full_name}`)
      )
    }

    // full output
    success(`Available ${isOffical ? 'official' : username}'s templates:`)
    response.data.forEach(item =>
      info(
        ` ${colors.yellow('→')} ${colors.blue(
          username === 'zce-templates' ? item.name : item.full_name
        )} ${colors.gray('-')} ${item.description}`
      )
    )

    // send it back (for testing, mostly)
    return response.data
  }
}
