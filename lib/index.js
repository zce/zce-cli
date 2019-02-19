/**
 * Export all commands
 */

module.exports = new Proxy({}, {
  get: (target, cmd) => require(`./commands/${cmd}`)
})

// // `init` command
// exports.init = require('./init')

// // `list` command
// exports.list = require('./list')

// Load on demand
// https://github.com/sindresorhus/import-lazy
