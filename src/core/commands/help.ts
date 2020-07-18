import { logger } from '../helpers'
import { load, commands, Command } from '../loader'
import { Context, Options } from '../parser'

const outputCommands = (): void => {
  const cmds = [...new Set(Object.values(commands))].filter(i => i.hidden !== true && i.name !== 'default')

  /* istanbul ignore else */
  if (cmds.length > 0) {
    logger.newline()
    logger.info('Commands:')

    const infos: Array<[string, string]> = cmds.map(i => [
      `${i.name}${i.alias == null ? '' : ` (${i.alias.toString()})`}`,
      i.description ?? /* istanbul ignore next */ '-'
    ])

    logger.table(infos, 10, 2)
  }
}

const outputOptions = (options: Options): void => {
  logger.newline()
  logger.info('Options:')

  // 'l' => '-l'
  // 'ls' => '--ls'
  const optKey = (k: string): string => `${k.length === 1 ? '-' : '--'}${k}`

  const infos: Array<[string, string]> = Object.keys(options).map(k => {
    const opt = options[k]
    const keys = [`--${k}`]
    let value = '-'
    if (typeof opt === 'object') {
      if (Array.isArray(opt.alias)) {
        keys.push(...opt.alias.map(optKey))
      } else if (typeof opt.alias === 'string') {
        keys.push(optKey(opt.alias))
      }
      value = opt.description ?? '-'
    }
    return [keys.join(', '), value]
  })

  logger.table(infos, 10, 2)
}

const outputTips = (title: string, tips: string | string[], bin: string): void => {
  logger.newline()
  logger.info(title)
  if (typeof tips !== 'string') {
    tips = tips.join('\n')
  }
  logger.info(logger.indent(tips.replace(/\[bin\]/g, bin)))
}

/**
 * Print help info.
 * @param cmd command
 * @param ctx context
 */
export const outputHelp = (cmd: Command, ctx: Context): void => {
  if (cmd.description != null) {
    logger.info(cmd.description)
    logger.newline()
  }

  logger.info('Usage:')
  logger.info(logger.indent(`$ ${ctx.bin} ${cmd.usage ?? `${cmd.name} [options]`}`))

  if (cmd.name === 'default') {
    outputCommands()
  }

  if (cmd.options != null) {
    outputOptions(cmd.options)
  }

  if (cmd.examples != null) {
    outputTips('Examples:', cmd.examples, ctx.bin)
  }

  if (cmd.suggestions != null) {
    outputTips('Suggestions:', cmd.suggestions, ctx.bin)
  }
}

/**
 * Invoke command help.
 * @param cmd command
 * @param ctx context
 */
export const invokeHelp = async (cmd: Command, ctx: Context): Promise<void> => {
  if (cmd.help != null) {
    // custom help
    if (typeof cmd.help === 'string') {
      logger.info(cmd.help)
    } else {
      await cmd.help(ctx)
    }
  } else {
    // default help
    outputHelp(cmd, ctx)
  }

  process.exit()
}

const command: Command = {
  name: 'help',
  usage: 'help <command>',
  description: 'output usage information.',
  action: async (ctx) => {
    const cmd = await load(ctx.primary ?? 'default')
    return await invokeHelp(cmd, ctx)
  }
}

export default command
