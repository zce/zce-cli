const readline = require('readline')

const ora = require('ora')
const boxen = require('boxen')
const symbols = require('log-symbols')

/**
 * Log message.
 * @param {any[]} params message
 */
exports.log = (...params) => {
  console.log(...params)
}

/**
 * Log message with a success symbol.
 * @param {string} message message
 */
exports.success = message => {
  exports.log(symbols.success, message)
}

/**
 * Log message with a error symbol.
 * @param {string} message message
 */
exports.error = message => {
  exports.log(symbols.error, message)
}

/**
 * Log message with a warn symbol.
 * @param {string} message message
 */
exports.warn = message => {
  exports.log(symbols.warning, message)
}

/**
 * Log message with a info symbol.
 * @param {string} message message
 */
exports.info = message => {
  exports.log(symbols.info, message)
}

/**
 * Boxen log message.
 * @param {string} message message
 */
exports.boxen = message => {
  const styles = { padding: 1, margin: 1, borderColor: 'yellow', borderStyle: 'round', dimBorder: false }
  exports.log(boxen(message, styles))
}

/**
 * Message spinner.
 * @param {string} message message
 */
exports.ora = message => {
  return ora({
    text: message,
    isEnabled: process.env.NODE_ENV !== 'test'
  })
}

/**
 * Clear console.
 * @param {string} title default title
 */
exports.clear = title => {
  if (!process.stdout.isTTY) return
  const blank = '\n'.repeat(process.stdout.rows)
  exports.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
  title && exports.log(title)
}
