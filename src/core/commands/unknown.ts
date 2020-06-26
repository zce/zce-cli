import { unknownCommand } from '../error'
import { Command, Context } from '../types'

const command: Command = {
  name: 'unknown',
  hidden: true,
  action: async (ctx: Context) => {
    if (!ctx.primary) return
    unknownCommand(ctx.primary, `${ctx.bin} --help`)
  }
}

export default command
