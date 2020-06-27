import { Command, Context } from '../core'
const { description } = require('../../package.json')

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: description,
  action: async (ctx: Context) => {
    // process.env.NODE_ENV === 'test' || require('zce')()
    console.log('zce-cli')
  }
}

export default command
