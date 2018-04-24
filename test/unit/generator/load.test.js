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
  const options = await load(path.join(__dirname, '../../mock/templates/options'))
  t.is(options.name, 'options-template')
  t.is(options.version, '0.1.0')
})

test('generator:load:empty', async t => {
  const options = await load(path.join(__dirname, '../../mock/templates/minima'))
  t.is(options.name, undefined)
})

test('generator:load:error1', async t => {
  await t.throws(load(path.join(__dirname, '../../tool/mock-prompt')), TypeError)
})

test('generator:load:error2', async t => {
  await t.throws(load(path.join(__dirname, '../../mock/templates/minima/README.md')), SyntaxError)
})
