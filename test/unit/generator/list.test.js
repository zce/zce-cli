/**
 * generator:list
 */

const test = require('ava')
const list = require('../../../lib/generator/list')

/**
 * test dependencies
 */
const mockStdio = require('../../tool/mock-stdio')

test.before(t => {
  // turn off stdout
  t.context.stop = mockStdio.stdout()
})

test.after(t => {
  // turn on stdout
  t.context.stop()
})

test('generator:list:offical', async t => {
  await list()
  t.pass()
})

test('generator:list:offical_short', async t => {
  await list('zce-templates', { short: true })
  t.pass()
})

test('generator:list:empty', async t => {
  await list('fake-users')
  t.pass()
})

test('generator:list:other', async t => {
  await list('zce-mock')
  t.pass()
})

test('generator:list:other_short', async t => {
  await list('zce-mock', { short: true })
  t.pass()
})

test('generator:list:not_found', async t => {
  await list('zce-faker-12315')
  t.pass()
})
