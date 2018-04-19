const test = require('ava')

const { logger } = require('../../../lib/common')

test('common:logger', t => {
  logger.success('hello zce-cli')
  logger.error('hello zce-cli')
  logger.warn('hello zce-cli')
  logger.info('hello zce-cli')
  logger.boxen('hello zce-cli')
  logger.clearConsole('zce-cli')
  t.pass()
})
