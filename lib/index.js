/**
 * Export all commands
 */

// Load on demand
module.exports = new Proxy({}, {
  get: (target, cmd) => require(`./${cmd}`)
})
