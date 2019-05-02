import { GluegunToolbox } from 'gluegun'
import { HelpMessage } from '../types'

export default async (toolbox: GluegunToolbox): Promise<void> => {
  // const brand = (toolbox.runtime && toolbox.runtime.brand) || 'zce'
  // toolbox.help = (message: HelpMessage) => outputHelp(brand, message)
  toolbox.help = (message: HelpMessage | string): void => {
    if (typeof message === 'string') {
      return toolbox.print.info(message)
    }

    if (message.description) {
      toolbox.print.info(message.description)
      toolbox.print.newline()
    }

    toolbox.print.info('Usage:')
    toolbox.print.info(`  $ ${message.usage}`)

    if (message.commands) {
      toolbox.print.newline()
      toolbox.print.info('Commands:')
      if (message.commands instanceof Array) {
        toolbox.print.table(message.commands)
      } else {
        toolbox.print.table(
          Object.keys(message.commands).map(k => [
            k,
            (message.commands as {})[k]
          ])
        )
      }
    }

    if (message.options) {
      toolbox.print.newline()
      toolbox.print.info('Options:')
      if (message.options instanceof Array) {
        toolbox.print.table(message.options)
      } else {
        toolbox.print.table(
          Object.keys(message.options).map(k => [k, (message.options as {})[k]])
        )
      }
    }

    if (message.examples) {
      toolbox.print.newline()
      toolbox.print.info('Examples:')
      if (typeof message.examples === 'string') {
        toolbox.print.table([[message.examples]])
      } else {
        toolbox.print.table(message.examples.map(i => [i]))
      }
    }

    if (message.suggestions) {
      toolbox.print.newline()
      toolbox.print.info('Suggestions:')
      if (typeof message.suggestions === 'string') {
        toolbox.print.table([[message.suggestions]])
      } else {
        toolbox.print.table(message.suggestions.map(i => [i]))
      }
    }
  }
}
