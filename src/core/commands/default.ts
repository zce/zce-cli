import { unknownCommand } from '../error'

import { Command, Context } from '../types'

const command: Command = {
  name: 'default',
  action: async (ctx: Context): Promise<any> => {
    if (ctx.primary) {
      return unknownCommand(ctx.primary, `${ctx.brand} --help`)
    }

    process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export default command
