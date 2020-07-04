import { logger } from '../helpers'
import { Command } from '../loader'

const command: Command = {
  name: 'version',
  usage: '--version',
  description: 'output the version number.',
  action: async ({ pkg }) => {
    logger.info(`${pkg.name} v${pkg.version}`)
  }
}

export default command
