/**
 * Logger
 */

const boxen = require('boxen')
const symbols = require('log-symbols')

exports.log = console.log

exports.success = message => console.log(symbols.success, message)

exports.error = message => console.error(symbols.error, message)

exports.warn = message => console.warn(symbols.warning, message)

exports.info = message => console.info(symbols.info, message)

const styles = { padding: 1, margin: 1, borderColor: 'yellow', borderStyle: 'round', dimBorder: false }
exports.boxen = message => console.log(boxen(message, styles))
