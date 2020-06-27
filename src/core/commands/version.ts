import { logger } from '../helpers'
import { Command, Context } from '../types'

const command: Command = {
  name: 'version',
  usage: '--version',
  description: 'output the version number.',
  action: async (ctx: Context) => {
    logger.info(`${ctx.pkg.name} v${ctx.pkg.version}`)
  }
}

export default command
