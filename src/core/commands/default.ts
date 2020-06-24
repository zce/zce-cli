import { unknownCommand } from '../error'
import { Command, Context } from '../types'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { description } = require('../../../package.json')

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: description,
  hidden: true,
  action: async (ctx: Context) => {
    if (!ctx.primary) return
    // unknown command
    unknownCommand(ctx.primary, `${ctx.brand} --help`)
  }
}

export default command
