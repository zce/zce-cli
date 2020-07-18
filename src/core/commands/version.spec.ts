import command from './version'
import { createFakeContext } from '../../../test/utils'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log?.mockRestore()
})

test('unit:core:commands:version', async () => {
  expect(command.name).toBe('version')
  expect(command.usage).toBe('--version')
  expect(command.description).toBe('output the version number.')
  expect(typeof command.action).toBe('function')
})

test('unit:core:commands:version:action', async () => {
  const ctx = createFakeContext()
  await command.action(ctx)
  expect(log.mock.calls[0][0]).toBe('zce-cli v0.1.0')
})
