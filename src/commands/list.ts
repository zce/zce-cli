import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'list',
  alias: 'ls',
  description: 'list available official templates',
  run: async (toolbox: GluegunToolbox) => {
    const { parameters, print, request } = toolbox
    const { first: username } = parameters
    const res = await request(`/users/${username || 'zce-templates'}/repos`, {
      per_page: 100
    })
    print.info(res)
  }
}
