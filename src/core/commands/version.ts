import { logger } from '../helpers'

import { Command, Context } from '../types'

const command: Command = {
  name: 'version',
  action: async (ctx: Context): Promise<any> => {
    const { name, version } = ctx.pkg
    logger.info(`${name} v${version}`)
  }
}

export default command
