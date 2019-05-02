import { GluegunToolbox, GluegunCommand } from 'gluegun'

export const zce: GluegunCommand = {
  name: 'zce',
  hidden: true,
  dashed: true,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    if (toolbox.parameters.first) {
      toolbox.print.error(`Unknown command: \`${toolbox.parameters.first}\`.`)
      toolbox.print.error('Type `zce --help` to view all commands.')
      return
    }

    process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export const version: GluegunCommand = {
  name: 'version',
  description: 'Output the version number',
  hidden: true,
  dashed: true,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    const { print, pluginName, meta } = toolbox
    print.info(`${pluginName} v${meta.version()}`)
  }
}

export const help: GluegunCommand = {
  name: 'help',
  description: 'Output usage information',
  hidden: true,
  dashed: true,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    toolbox.help({
      usage: 'zce <command> [options]',
      commands: toolbox.meta.commandInfo(),
      suggestions: `Run \`${
        toolbox.pluginName
      } <command> --help\` for detailed usage of given command.`
    })
  }
}
