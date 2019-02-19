const chalk = require('chalk')
const boxen = require('boxen')
const updateNotifier = require('update-notifier')

/**
 * Update check
 * @param {Object} pkg package info
 */
module.exports = pkg => {
  const { update } = updateNotifier({
    pkg,
    updateCheckInterval: 60 * 60 * 1000 // 1 hour
  })

  if (!update) return

  process.on('exit', () => {
    let messages = `Update available: ${chalk.dim(update.current)} → ${chalk.green(update.latest)}`
    messages += `\nPlease run ${chalk.cyan(`yarn global add ${update.name}`)} to update`

    console.log(boxen(messages, {
      padding: 1,
      margin: 1,
      align: 'center',
      borderColor: 'yellow',
      borderStyle: 'round'
    }))
  })
}
