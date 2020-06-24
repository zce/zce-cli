import { unknownCommand, Command, Context } from '../core'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { description } = require('../../package.json')

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: description,
  action: async (ctx: Context) => {
    if (ctx.primary) {
      return unknownCommand(ctx.primary, `${ctx.brand} --help`)
    }
    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // process.env.NODE_ENV === 'test' || require('zce')()
    console.log('zce-cli')
  }
}

export default command
