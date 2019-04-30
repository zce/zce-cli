import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'init',
  alias: [],
  description: 'generate a new project from a template',
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox
    print.info('init')
  }
}
