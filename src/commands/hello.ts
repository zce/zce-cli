import { GluegunToolbox } from 'gluegun'

module.exports = {
  run: async (toolbox: GluegunToolbox) => {
    toolbox.hello()
    toolbox.print.info('Hello, world!')
  }
}