import { logger, missingArgument, Command, Context } from '../core'

export default {
  name: 'hello',
  usage: 'hello <name> [options]',
  description: 'hello command',
  alias: 'hi',
  // hidden: true,
  options: {
    lang: {
      type: 'string',
      alias: 'l',
      default: 'en',
      description: 'message language'
    },
    debug: {
      type: 'boolean',
      alias: 'd',
      description: 'debug mode'
    }
  },
  action: async (ctx: Context) => {
    if (!ctx.primary) {
      return missingArgument('name')
    }

    if (ctx.options.lang === 'en') {
      logger.success(`Hey! ${ctx.primary}~`)
    } else if (ctx.options.lang === 'zh') {
      logger.success(`嘿！${ctx.primary}`)
    }

    if (ctx.options.debug) {
      logger.debug(ctx)
    }
  }
} as Command
