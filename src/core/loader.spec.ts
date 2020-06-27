import * as loader from './loader'
const pkg = require('../../package.json')

test('unit:core:loader:load:custom', async () => {
  const cmd = await loader.load('default')
  expect(cmd.name).toBe('default')
  expect(cmd.usage).toBe('<command> [options]')
  expect(cmd.description).toBe(pkg.description)
  expect(typeof cmd.action).toBe('function')
})

test('unit:core:loader:load:version', async () => {
  const cmd = await loader.load('version')
  expect(cmd.name).toBe('version')
  expect(cmd.description).toBe('output the version number.')
  expect(typeof cmd.action).toBe('function')
})

test('unit:core:loader:load:help', async () => {
  const cmd = await loader.load('help')
  expect(cmd.name).toBe('help')
  expect(cmd.usage).toBe('help <command>')
  expect(cmd.description).toBe('output usage information.')
  expect(typeof cmd.action).toBe('function')
})

test('unit:core:loader:load:unknown', async () => {
  const cmd = await loader.load('unknown')
  expect(cmd.name).toBe('unknown')
  expect(cmd.hidden).toBe(true)
  expect(typeof cmd.action).toBe('function')
})
