const test = require('ava')

const Defaults = require('../../../lib/generator/defaults')

const path = require('path')

test('generator:defaults:all', async t => {
  const defaults = new Defaults(__dirname)
  t.is(defaults.name(), path.basename(__dirname))
  await defaults.username()
  await defaults.fullname()
  await defaults.author()
  defaults.version()
  defaults.license()
  defaults.repository()
  defaults.repo()
  t.pass()
})

test('generator:defaults:error', t => {
  t.throws(() => new Defaults(), TypeError)
})

test('generator:defaults:save', async t => {
  await Defaults.save({ foo: 'bar', repo: 'demo' })
  const defaults = new Defaults(__dirname)
  t.is(defaults.foo, 'bar')
  t.is(typeof defaults.repo, 'function')
})
