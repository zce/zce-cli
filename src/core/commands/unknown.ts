import { unknownCommand } from '../helpers'
import { Command, Context } from '../types'

const command: Command = {
  name: 'unknown',
  alias: ['unknown1'], // for testing coverage
  hidden: true,
  action: async (ctx: Context) => {
    if (!ctx.primary) return
    unknownCommand(ctx.primary, `${ctx.bin} --help`)
  }
}

export default command
