import { GluegunToolbox } from 'gluegun'

module.exports = {
  name: 'zce',
  description: 'A CLI tool for my personal productivity',
  run: async (toolbox: GluegunToolbox) => {
    toolbox.zce()
  }
}
