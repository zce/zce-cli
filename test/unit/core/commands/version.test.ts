import command from '../../../../src/core/commands/version'
import { createFakeContext, sinon } from '../../../utils'

test('unit:core:commands:version', async (): Promise<void> => {
  expect(command.name).toBe('version')
  expect(command.usage).toBe('version')
  expect(command.description).toBe('output the version number')
  expect(command.hidden).toBe(false)
  expect(typeof command.action).toBe('function')
})

test('unit:core:commands:version:action', async (): Promise<void> => {
  const spy = sinon.spy(console, 'log')

  const ctx = createFakeContext()
  await command.action(ctx)

  expect(spy.args[0][0]).toBe('zce-cli v0.1.0')

  spy.restore()
})
