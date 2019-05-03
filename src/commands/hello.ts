import { logger, Command, Context } from '../core'

const command: Command = {
  name: 'hello',
  usage: 'hello <name> [options]',
  description: 'Hello command',
  alias: 'hi',
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
      return logger.error('Missing required argument: `%s`.', 'name')
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
}

export default command
