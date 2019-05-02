import { stub, SinonStub } from 'sinon'
import hello from '../../../src/commands/hello'
import { createFakeToolbox } from '../../utils'

test('unit:commands:hello', async (): Promise<void> => {
  expect(hello.name).toBe('hello')
  expect(hello.alias).toBe('hi')
  expect(hello.description).toBe('Hello command')
  expect(hello.hidden).toBe(true)
  expect(hello.dashed).toBe(true)
  expect(typeof hello.run).toBe('function')
})

test('unit:commands:hello:call', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.hello = stub()
  await hello.run(toolbox)
  const hi = toolbox.hello as SinonStub
  expect(hi.getCall(0).args[0]).toBe('world')
})

test('unit:commands:hello:help', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.help = stub()
  toolbox.parameters.options.help = false
  toolbox.parameters.options.h = true
  await hello.run(toolbox)
  const help = toolbox.help as SinonStub
  const arg = help.getCall(0).args[0]
  expect(arg.description).toBe('Hello command')
  expect(arg.usage).toBe('zce hello [options]')
})
