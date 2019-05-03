import { unknownCommand } from '../error'

import { Command, Context } from '../types'

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: require('../../../package.json').description,
  hidden: true,
  action: async (ctx: Context): Promise<any> => {
    if (!ctx.primary) return
    // unknown command
    unknownCommand(ctx.primary, `${ctx.brand} --help`)
  }
}

export default command
