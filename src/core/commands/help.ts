import { logger } from '../helpers'
import { loadUserCommand, loadAllUserCommand } from '../loader'
import { unknownCommand } from '../error'

import { Command, Context } from '../types'

/**
 * Print help info.
 * @param brand brand name
 * @param cmd command
 */
const outputHelp = (brand: string, cmd: Command): void => {
  if (cmd.description) {
    logger.info(cmd.description)
    logger.newline()
  }

  logger.info('Usage:')
  const usage = cmd.usage || `${cmd.name} [options]`
  logger.info(logger.indent(`$ ${brand} ${usage}`))

  if (cmd.options) {
    logger.newline()
    logger.info('Options:')
    for (const key in cmd.options) {
      const value = cmd.options[key]
      if (typeof value === 'string') {
        logger.info(logger.indent(`--${key}\t\t-`))
      } else {
        const alias = value.alias ? `, -${value.alias}` : ''
        logger.info(logger.indent(`--${key}${alias}\t\t${value['description'] || '-'}`))
      }
    }
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
const subCommandHelp = (name: string, ctx: Context): void => {
  try {
    // user subcommand help
    const cmd = loadUserCommand(name)

    if (cmd.help) {
      if (typeof cmd.help === 'string') {
        return logger.info(cmd.help)
      }
      return cmd.help(ctx)
    }

    outputHelp(ctx.brand, cmd)
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e
    return unknownCommand(name, `${ctx.brand} --help`)
  }
}

/**
 * Show default command help.
 * @param ctx cli context
 */
const defaultHelp = (ctx: Context): void => {
  // const helpMessage = `${ctx.pkg.description}`
  if (ctx.pkg.description) {
    logger.info(ctx.pkg.description)
    logger.newline()
  }

  logger.info('Usage:')
  logger.info(`  $ ${ctx.brand} <command> [options]`)

  const commands = loadAllUserCommand()
  if (commands.length) {
    logger.newline()
    logger.info('Commands:')
    logger.info(
      logger.indent(
        commands
          .filter(c => !c.hidden)
          .map(
            c => `${c.name}${c.alias ? `(${c.alias})` : ''}\t\t${c.description || '-'}`
          )
          .join('\n')
      )
    )
  }
}

const command: Command = {
  name: 'help',
  action: async (ctx: Context): Promise<any> => {
    // TODO: zce --help foo foo
    if (ctx.primary && ctx.primary !== 'help') {
      subCommandHelp(ctx.primary, ctx)
    } else if (ctx.primary === 'help' && ctx.secondary) {
      subCommandHelp(ctx.secondary, ctx)
    } else {
      defaultHelp(ctx)
    }
    process.exit(2)
  }
}

export default command
