import { print, GluegunToolbox } from 'gluegun'
import { HelpMessage } from '../types'

const outputHelp = (message: HelpMessage | string): void => {
  if (typeof message === 'string') {
    return print.info(message)
  }

  if (message.description) {
    print.info(message.description)
    print.newline()
  }

  print.info('Usage:')
  print.info(`  $ ${message.usage}`)

  if (message.commands) {
    print.newline()
    print.info('Commands:')
    if (message.commands instanceof Array) {
      print.table(message.commands)
    } else {
      print.table(
        Object.keys(message.commands).map(k => [k, (message.commands as {})[k]])
      )
    }
  }

  if (message.options) {
    print.newline()
    print.info('Options:')
    if (message.options instanceof Array) {
      print.table(message.options)
    } else {
      print.table(
        Object.keys(message.options).map(k => [k, (message.options as {})[k]])
      )
    }
  }

  if (message.examples) {
    print.newline()
    print.info('Examples:')
    if (typeof message.examples === 'string') {
      print.table([[message.examples]])
    } else {
      print.table(message.examples.map(i => [i]))
    }
  }

  if (message.suggestions) {
    print.newline()
    print.info('Suggestions:')
    if (typeof message.suggestions === 'string') {
      print.table([[message.suggestions]])
    } else {
      print.table(message.suggestions.map(i => [i]))
    }
  }
}

export default async (toolbox: GluegunToolbox): Promise<void> => {
  // const brand = (toolbox.runtime && toolbox.runtime.brand) || 'zce'
  // toolbox.help = (message: HelpMessage) => outputHelp(brand, message)
  toolbox.help = outputHelp
}
