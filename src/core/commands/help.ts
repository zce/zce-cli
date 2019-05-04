import { userCommands, coreCommands } from '../loader'
import { unknownCommand } from '../error'
import { logger } from '../helpers'

import { Command, Context } from '../types'

/**
 * Print help info.
 * @param brand brand name
 * @param cmd command
 */
const outputHelp = async (brand: string, cmd: Command) => {
  if (cmd.description) {
    logger.info(cmd.description)
    logger.newline()
  }

  logger.info('Usage:')
  const usage = cmd.usage || `${cmd.name} [options]`
  logger.info(logger.indent(`$ ${brand} ${usage}`))

  // output commands if default command
  if (cmd.name === 'default') {
    const userCmds = [...new Set(Object.values(userCommands))]
    const coreCmds = [...new Set(Object.values(coreCommands))]
    if (userCmds.length + coreCmds.length) {
      logger.newline()
      logger.info('Commands:')
      const commandsObj = userCmds
        .concat(coreCmds)
        .filter(i => !i.hidden && i.name !== 'default')
        .reduce((obj, item) => {
          const key = `${item.name}${item.alias ? `(${item.alias})` : ''}`
          const value = item.description || '-'
          return { ...obj, [key]: value }
        }, {})
      logger.info(logger.indent(logger.table(commandsObj)))
    }
  }

  if (cmd.options) {
    logger.newline()
    logger.info('Options:')
    const options = cmd.options
    const optionsObj = Object.keys(options).reduce((o, i) => {
      const opt = options[i]
      let key = `--${i}`
      let value = '-'
      if (typeof opt !== 'string') {
        key = `--${i}${opt.alias ? `, -${opt.alias}` : ''}`
        value = opt['description'] || '-'
      }
      return { ...o, [key]: value }
    }, {})
    logger.info(logger.indent(logger.table(optionsObj)))
  }

  if (cmd.examples) {
    logger.newline()
    logger.info('Examples:')
    if (typeof cmd.examples === 'string') {
      logger.info(logger.indent(`${cmd.examples}`))
    } else {
      logger.info(logger.indent(cmd.examples.join('\n')))
    }
  }

  if (cmd.suggestions) {
    logger.newline()
    logger.info('Suggestions:')
    if (typeof cmd.suggestions === 'string') {
      logger.info(logger.indent(`${cmd.suggestions}`))
    } else {
      logger.info(logger.indent(cmd.suggestions.join('\n')))
    }
  }
}

/**
 * Show sub command help.
 * @param name command name
 * @param ctx cli context
 */
const subCommandHelp = async (name: string, ctx: Context) => {
  const cmd = userCommands[name]
  if (!cmd) return unknownCommand(name, `${ctx.brand} --help`)

  // custom help
  if (cmd.help) {
    if (typeof cmd.help === 'string') {
      return logger.info(cmd.help)
    }
    return await cmd.help(ctx)
  }

  // default help
  await outputHelp(ctx.brand, cmd)
}

const command: Command = {
  name: 'help',
  usage: 'help <command>',
  description: 'output usage information',
  hidden: false,
  action: async (ctx: Context) => {
    if (ctx.primary && ctx.primary !== 'help') {
      await subCommandHelp(ctx.primary, ctx)
    } else if (ctx.primary === 'help' && ctx.secondary) {
      await subCommandHelp(ctx.secondary, ctx)
    } else {
      await outputHelp(ctx.brand, userCommands.default || coreCommands.default)
    }
    process.exit()
  }
}

export default command
