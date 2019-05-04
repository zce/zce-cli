import { unknownCommand, Command, Context } from '../core'

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: require('../../package.json').description,
  action: async (ctx: Context) => {
    if (ctx.primary) {
      return unknownCommand(ctx.primary, `${ctx.brand} --help`)
    }
    process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export default command
