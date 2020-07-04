import * as invoker from './invoker'
import { createFakeCommand, createFakeContext } from '../../test/utils'

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
  exit && exit.mockRestore()
})

test('unit:core:invoker:invoke', async () => {
  const cmd = createFakeCommand()
  const ctx = createFakeContext()

  await invoker.invoke(cmd, ctx)

  const action = (cmd.action as unknown) as jest.SpyInstance
  expect(action).toHaveBeenCalled()
  expect(action.mock.calls[0][0]).toBe(ctx)
})

test('unit:core:invoker:invoke:help:unknown', async () => {
  const cmd = createFakeCommand({ name: 'unknown' })
  const ctx = createFakeContext()

  await invoker.invoke(cmd, ctx)

  const action = (cmd.action as unknown) as jest.SpyInstance
  expect(action).toHaveBeenCalled()
  expect(action.mock.calls[0][0]).toBe(ctx)
})

test('unit:core:invoker:invoke:help', async () => {
  const cmd = createFakeCommand()
  const ctx = createFakeContext({ options: { help: true } })

  await invoker.invoke(cmd, ctx)

  const action = (cmd.action as unknown) as jest.SpyInstance
  expect(action).not.toHaveBeenCalled()
  expect(exit.mock.calls[0][0]).toBe(undefined)
})
