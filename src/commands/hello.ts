import { logger, missingArgument, Command } from '../core'

const command: Command = {
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
  examples: ['hello zce'],
  action: async ({ primary, options }) => {
    if (!primary) {
      return missingArgument('name')
    }

    if (options.lang === 'en') {
      logger.success(`Hey! ${primary}~`)
    } else if (options.lang === 'zh') {
      logger.success(`嘿！${primary}~`)
    }

    if (options.debug) {
      logger.debug(options)
    }
  }
}

export default command
