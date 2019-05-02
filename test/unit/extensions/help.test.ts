import { SinonStub } from 'sinon'
import help from '../../../src/extensions/help'
import { createFakeToolbox } from '../../utils'

test('unit:extensions:help', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await help(toolbox)
  expect(typeof toolbox.help).toBe('function')
})

test('unit:extensions:help:call-with-string', async (): Promise<void> => {
  const toolbox = createFakeToolbox()
  await help(toolbox)
  toolbox.help('help info')
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('help info')
})

test('unit:extensions:help:call-with-message-object', async (): Promise<
void
> => {
  const toolbox = createFakeToolbox()
  await help(toolbox)
  toolbox.help({
    usage: 'zce foo'
  })
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('Usage:')
  expect(info.getCall(1).args[0]).toBe('  $ zce foo')
})

test('unit:extensions:help:call-with-full-message-object', async (): Promise<
void
> => {
  const toolbox = createFakeToolbox()
  await help(toolbox)
  toolbox.help({
    description: 'test command',
    usage: 'zce <command>',
    commands: {
      foo: 'bar'
    },
    options: {
      '-v': 'verbose'
    },
    examples: '$ zce foo -v',
    suggestions: 'Run `zce foo --help`'
  })
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('test command')
  expect(info.getCall(1).args[0]).toBe('Usage:')
  expect(info.getCall(2).args[0]).toBe('  $ zce <command>')
  const newline = toolbox.print.newline as SinonStub
  expect(newline.callCount).toBe(5)
  const table = toolbox.print.table as SinonStub
  expect(table.callCount).toBe(4)
})

test('unit:extensions:help:call-with-full-message-object2', async (): Promise<
void
> => {
  const toolbox = createFakeToolbox()
  await help(toolbox)
  toolbox.help({
    description: 'test command',
    usage: 'zce <command>',
    commands: [['foo', 'bar']],
    options: [['-v', 'verbose']],
    examples: ['$ zce foo -v'],
    suggestions: ['Run `zce foo --help`']
  })
  const info = toolbox.print.info as SinonStub
  expect(info.getCall(0).args[0]).toBe('test command')
  expect(info.getCall(1).args[0]).toBe('Usage:')
  expect(info.getCall(2).args[0]).toBe('  $ zce <command>')
  const newline = toolbox.print.newline as SinonStub
  expect(newline.callCount).toBe(5)
  const table = toolbox.print.table as SinonStub
  expect(table.callCount).toBe(4)
})
