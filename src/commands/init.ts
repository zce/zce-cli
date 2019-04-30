import { GluegunToolbox } from 'gluegun'

module.exports = {
  run: async (toolbox: GluegunToolbox) => {
    const { print } = toolbox
    print.info('init')
  }
}
