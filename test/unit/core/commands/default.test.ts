import command from '../../../../src/core/commands/default'
import { createFakeContext, sinon } from '../../../utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { description } = require('../../../../package.json')

test('unit:core:commands:default', async (): Promise<void> => {
  expect(command.name).toBe('default')
  expect(command.usage).toBe('<command> [options]')
  expect(command.description).toBe(description)
  expect(command.hidden).toBe(true)
  expect(typeof command.action).toBe('function')
})

test('unit:core:commands:default:action', async (): Promise<void> => {
  const spy = sinon.spy(console, 'log')
  const stub = sinon.stub(process, 'exit')

  const ctx1 = createFakeContext()
  await command.action(ctx1)

  const ctx2 = createFakeContext({ primary: 'foo' })
  await command.action(ctx2)

  expect(spy.args[0][0]).toBe('Unknown command: `%s`.')
  expect(spy.args[0][1]).toBe('foo')
  expect(spy.args[1][0]).toBe('Type `%s` to view all commands.')
  expect(spy.args[1][1]).toBe('zce --help')
  expect(stub.args[0][0]).toBe(1)

  spy.restore()
  stub.restore()
})
