import { unknownCommand, Command, Context } from '../core'
import { description } from '../../package.json'

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: description,
  action: async (ctx: Context) => {
    if (ctx.primary) {
      return unknownCommand(ctx.primary, `${ctx.brand} --help`)
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export default command
