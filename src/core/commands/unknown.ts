import { unknownCommand } from '../helpers'
import { Command } from '../loader'

const command: Command = {
  name: 'unknown',
  alias: ['unknown1'], // for testing coverage
  hidden: true,
  action: async ({ bin, primary }) => {
    if (!primary) return
    unknownCommand(primary, `${bin} --help`)
  }
}

export default command
