/**
 * Export all commands
 */

const common = require('./common')

exports.generator = require('./generator')

exports.server = require('./server')

Object.assign(exports, common)
