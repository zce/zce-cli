import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'hello',
  description: 'Gluegun demo command',
  run: async (toolbox: GluegunToolbox) => {
    toolbox.hello()
    toolbox.print.info('Hello, world!')
  }
}
