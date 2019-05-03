import { Command, Context } from '../core'

const command: Command = {
  name: 'default',
  usage: '<name> [options]',
  description: require('../../package.json').description,
  action: async (ctx: Context) => {
    process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export default command
