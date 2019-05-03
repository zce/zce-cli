import { logger, Command, Context } from '../core'

const command: Command = {
  name: 'foo',
  usage: 'foo <name> [options]',
  description: 'Foo command',
  alias: 'f',
  options: {
    verbose: {
      type: 'boolean',
      alias: 'v',
      default: false,
      description: 'verbose mode verbose mode'
    },
    debug: {
      type: 'boolean',
      alias: 'd',
      description: 'debug mode'
    }
  },
  action: async (ctx: Context) => {
    logger.info('foo')
  },
  examples: `help examples`,
  suggestions: `help suggestions`
}

export default command
