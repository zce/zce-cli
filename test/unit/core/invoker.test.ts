import * as invoker from '../../../src/core/invoker'
import { createFakeCommand, createFakeContext, sinon } from '../../utils'

test('unit:core:invoker', async (): Promise<void> => {
  expect(invoker.invoke).toBeTruthy()
})

test('unit:core:invoker:invoke', async (): Promise<void> => {
  const cmd = createFakeCommand()
  const ctx = createFakeContext()

  await invoker.invoke(cmd, ctx)

  const action = cmd.action as sinon.SinonStub
  expect(action.args[0][0]).toBe(ctx)
})

test('unit:core:invoker:invoke:help', async (): Promise<void> => {
  const stub = sinon.stub(process, 'exit')
  const cmd = createFakeCommand()
  const ctx = createFakeContext()
  ctx.options.h = true

  await invoker.invoke(cmd, ctx)

  const action = cmd.action as sinon.SinonStub
  expect(action.notCalled).toBe(true)
  expect(stub.args[0][0]).toBe(undefined)
})
