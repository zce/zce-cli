import { SinonStub } from 'sinon'
import hello from '../../../src/extensions/hello'
import { createFakeToolbox } from '../../utils'

test('unit:extensions:hello', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await hello(toolbox)
  expect(typeof toolbox.hello).toBe('function')
})

test('unit:extensions:hello:call', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await hello(toolbox)
  toolbox.hello('zce')
  const rainbow = toolbox.print.colors.rainbow as SinonStub
  expect(rainbow.getCall(0).args[0]).toBe('Hey zce~')
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('rainbow string')
})
