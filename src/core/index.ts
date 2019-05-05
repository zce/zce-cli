import { sniff } from './sniffer'

// check the node version
sniff()

// // Prevent caching of this module so module.parent is always accurate
// delete require.cache[__filename]
// global['parentDir'] = module.parent ? dirname(module.parent.filename) : ''

export { run } from './runner'
export { logger, template } from './helpers'
export { unknownCommand, missingArgument } from './error'
export { Command, Context } from './types'
