import { GluegunCommand, GluegunToolbox } from 'gluegun'
import { HelpMessage } from '../types'

const description = 'Hello command'

const helpMessage: HelpMessage = {
  description,
  usage: 'zce hello [options]',
  options: {
    '-n, --name': 'Your name',
    '-h, --help': 'Output usage information'
  },
  examples: ['$ zce hello --name zce', 'Hey zce~']
}

const command: GluegunCommand = {
  name: 'hello',
  alias: 'hi',
  description,
  hidden: true,
  dashed: true,
  run: async (toolbox: GluegunToolbox): Promise<void> => {
    if (toolbox.parameters.options.help || toolbox.parameters.options.h) {
      return toolbox.help(helpMessage)
    }

    toolbox.hello(toolbox.parameters.options.name || 'world')
  }
}

export default command
