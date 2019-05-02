import { stub, SinonStub } from 'sinon'
import init from '../../../src/commands/init'
import { createFakeToolbox } from '../../utils'

test('unit:commands:init', async (): Promise<void> => {
  expect(init.name).toBe('init')
  expect(init.alias).toBe(undefined)
  expect(init.description).toBe('Generate a new project from a template')
  expect(init.hidden).toBe(undefined)
  expect(init.dashed).toBe(undefined)
  expect(typeof init.run).toBe('function')
})

test('unit:commands:init:call', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.init = stub()
  await init.run(toolbox)
  const success = toolbox.print.success as SinonStub
  expect(success.getCall(0).args[0]).toBe(
    'Generate a new project from a template'
  )
})

test('unit:commands:init:help', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.help = stub()
  toolbox.parameters.options.help = false
  toolbox.parameters.options.h = true
  await init.run(toolbox)
  const help = toolbox.help as SinonStub
  const arg = help.getCall(0).args[0]
  expect(arg.description).toBe('Generate a new project from a template')
  expect(arg.usage).toBe('zce init <template> [project]')
})
