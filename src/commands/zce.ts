import { GluegunToolbox } from 'gluegun'

export default {
  name: 'zce',
  hidden: true,
  dashed: true,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { colors, error } = toolbox.print

    if (toolbox.parameters.first) {
      error(`Unknown command: \`${toolbox.parameters.first}\`.`)
      error(`Type \`${colors.cyan('zce --help')}\` to view all commands.`)
      return
    }

    process.env.NODE_ENV === 'test' || require('zce')()
  }
}
