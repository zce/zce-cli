import * as invoker from './invoker'
import { createFakeCommand, createFakeContext } from '../../test/utils'

let exit: jest.SpyInstance

beforeEach(async () => {
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  exit && exit.mockRestore()
})

test('unit:core:invoker', async () => {
  expect(invoker.invoke).toBeTruthy()
})

test('unit:core:invoker:invoke', async () => {
  const cmd = createFakeCommand()
  const ctx = createFakeContext()

  await invoker.invoke(cmd, ctx)

  const action = (cmd.action as unknown) as jest.SpyInstance
  expect(action.mock.calls[0][0]).toBe(ctx)
})

test('unit:core:invoker:invoke:help', async () => {
  const cmd = createFakeCommand()
  const ctx = createFakeContext()
  ctx.options.h = true

  await invoker.invoke(cmd, ctx)

  const action = (cmd.action as unknown) as jest.SpyInstance
  expect(action).not.toHaveBeenCalled()
  expect(exit.mock.calls[0][0]).toBe(undefined)
})
