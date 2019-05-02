import { stub, SinonStub } from 'sinon'
import list from '../../../src/commands/list'
import { createFakeToolbox } from '../../utils'

beforeEach(() => jest.setTimeout(10000))

test('unit:commands:list', async (): Promise<void> => {
  expect(list.name).toBe('list')
  expect(list.alias).toBe('ls')
  expect(list.description).toBe('List available official templates')
  expect(list.hidden).toBe(undefined)
  expect(list.dashed).toBe(undefined)
  expect(typeof list.run).toBe('function')
})

test('unit:commands:list:call-default', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await list.run(toolbox)
  const success = toolbox.print.success as SinonStub
  expect(success.getCall(0).args[0]).toBe("Available official's templates:")
})

test('unit:commands:list:call-json-output', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'fake-users'
  toolbox.parameters.options.j = true
  await list.run(toolbox)
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe(
    '[{"name":"fake-users/demo","description":null}]'
  )
})

test('unit:commands:list:call-json-output', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'fake-users'
  toolbox.parameters.options.s = true
  await list.run(toolbox)
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('→ fake-users/demo')
})

test('unit:commands:list:call-empty', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = 'ghost'
  await list.run(toolbox)
  const warning = toolbox.print.warning as SinonStub
  expect(warning.getCall(0).args[0]).toBe('No available templates.')
})

test('unit:commands:list:call-not-found', async (): Promise<void> => {
  const username = 'fake-user-' + Date.now()
  const toolbox = createFakeToolbox()
  toolbox.parameters.first = username
  await list.run(toolbox)
  const error = toolbox.print.error as SinonStub
  expect(error.getCall(0).args[0]).toBe(
    `Username does not exist: \`${username}\`.`
  )
})

test('unit:commands:list:help', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  toolbox.help = stub()
  toolbox.parameters.options.help = false
  toolbox.parameters.options.h = true
  await list.run(toolbox)
  const help = toolbox.help as SinonStub
  const arg = help.getCall(0).args[0]
  expect(arg.description).toBe('List available official templates')
  expect(arg.usage).toBe('zce list [username]')
})
