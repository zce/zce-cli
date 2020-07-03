import { Command } from '../core'
const pkg = require('../../package.json')

const command: Command = {
  name: 'default',
  usage: '<command> [options]',
  description: pkg.description,
  action: async () => {
    // process.env.NODE_ENV === 'test' || require('zce')()
  }
}

export default command
