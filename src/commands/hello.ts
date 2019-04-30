import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'hello',
  description: 'Gluegun demo command',
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    toolbox.hello()
    toolbox.print.info('Hello, world!')
  }
}
