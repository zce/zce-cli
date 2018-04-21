const test = require('ava')

const { logger } = require('../../../lib/common')

const symbols = require('log-symbols')
const mockStdio = require('../../tool/mock-stdio')

test('common:logger:log', t => {
  const stop = mockStdio.stdout()
  logger.log('hello zce-cli')
  t.is(stop(), 'hello zce-cli\n')
})

test('common:logger:success', t => {
  const stop = mockStdio.stdout()
  logger.success('hello zce-cli')
  t.is(stop(), `${symbols.success} hello zce-cli\n`)
})

test('common:logger:error', t => {
  const stop = mockStdio.stdout()
  logger.error('hello zce-cli')
  t.is(stop(), `${symbols.error} hello zce-cli\n`)
})

test('common:logger:warn', t => {
  const stop = mockStdio.stdout()
  logger.warn('hello zce-cli')
  t.is(stop(), `${symbols.warning} hello zce-cli\n`)
})

test('common:logger:info', t => {
  const stop = mockStdio.stdout()
  logger.info('hello zce-cli')
  t.is(stop(), `${symbols.info} hello zce-cli\n`)
})

test('common:logger:boxen', t => {
  const stop = mockStdio.stdout()
  logger.boxen('zce-cli')
  t.true(stop().includes('zce-cli'))
})
