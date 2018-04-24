/**
 * generator:load
 */

const test = require('ava')
const load = require('../../../lib/generator/load')

/**
 * test dependencies
 */
const path = require('path')

test('generator:load:normal', async t => {
  const options = await load(path.join(__dirname, '../../mock/minima'))
  t.is(options.name, 'minima')
})

test('generator:load:empty', async t => {
  const options = await load(path.join(__dirname, '../../mock'))
  t.is(options.name, undefined)
})

test('generator:load:error1', async t => {
  await t.throws(load(path.join(__dirname, '../../tool/mock-prompt')), TypeError)
})

test('generator:load:error2', async t => {
  await t.throws(load(path.join(__dirname, '../../mock/minima/README.md')), SyntaxError)
})
