import command from './default'
import { createFakeContext } from '../../test/utils'
const pkg = require('../../package.json')

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log?.mockRestore()
})

test('unit:commands:default', async () => {
  expect(command.name).toBe('default')
  expect(command.usage).toBe('<command> [options]')
  expect(command.description).toBe(pkg.description)
  expect(typeof command.action).toBe('function')
})

test('unit:commands:default:action', async () => {
  const ctx = createFakeContext()
  await command.action(ctx)
  expect(log).not.toHaveBeenCalled()
})
