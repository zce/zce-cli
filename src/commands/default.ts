import { Command, Context } from '../core'
const pkg = require('../../package.json')

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: pkg.description,
  action: async (ctx: Context) => {
    // process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export default command
