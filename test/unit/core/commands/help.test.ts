import command from '../../../../src/core/commands/help'
import { createFakeContext, sinon } from '../../../utils'

test('unit:core:commands:help', async (): Promise<void> => {
  expect(command.name).toBe('help')
  expect(command.usage).toBe('help <command>')
  expect(command.description).toBe('output usage information')
  expect(command.hidden).toBe(false)
  expect(typeof command.action).toBe('function')
})

test('unit:core:commands:help:action', async (): Promise<void> => {
  const spy = sinon.spy(console, 'log')
  const stub = sinon.stub(process, 'exit')

  const ctx = createFakeContext()
  await command.action(ctx)

  // TODO: expect help
  // expect(spy.args[0][0]).toBe('zce-cli v0.1.0')
  expect(stub.args[0][0]).toBe(undefined)

  spy.restore()
  stub.restore()
})
