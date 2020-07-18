import command, { outputHelp, invokeHelp } from './help'
import { createFakeCommand, createFakeContext } from '../../../test/utils'
const pkg = require('../../../package.json')

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log?.mockRestore()
  exit?.mockRestore()
})

test('unit:core:commands:help', async () => {
  expect(command.name).toBe('help')
  expect(command.usage).toBe('help <command>')
  expect(command.description).toBe('output usage information.')
  expect(typeof command.action).toBe('function')
})

test('unit:core:commands:help:action:1', async () => {
  const ctx = createFakeContext()
  await command.action(ctx)
  expect(log.mock.calls[0][0]).toBe(pkg.description)
  expect(exit.mock.calls[0][0]).toBe(undefined)
})

test('unit:core:commands:help:action:2', async () => {
  const ctx = createFakeContext({ primary: 'version' })
  await command.action(ctx)
  expect(log.mock.calls[0][0]).toBe('output the version number.')
  expect(exit.mock.calls[0][0]).toBe(undefined)
})

test('unit:core:commands:help:invokeHelp:1', async () => {
  const cmd = createFakeCommand()
  const ctx = createFakeContext()
  await invokeHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe(cmd.description)
  expect(exit.mock.calls[0][0]).toBe(undefined)
})

test('unit:core:commands:help:invokeHelp:2', async () => {
  const cmd = createFakeCommand({ help: 'custom help message' })
  const ctx = createFakeContext()
  await invokeHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe('custom help message')
  expect(exit.mock.calls[0][0]).toBe(undefined)
})

test('unit:core:commands:help:invokeHelp:3', async () => {
  const help = jest.fn()
  const cmd = createFakeCommand({ help })
  const ctx = createFakeContext()
  await invokeHelp(cmd, ctx)
  expect(help).toHaveBeenCalled()
  expect(help.mock.calls[0][0]).toBe(ctx)
  expect(exit.mock.calls[0][0]).toBe(undefined)
})

test('unit:core:commands:help:outputHelp:0', async () => {
  const cmd = createFakeCommand({ name: 'default' })
  const ctx = createFakeContext()
  outputHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe(cmd.description)
  expect(log.mock.calls[1][0]).toBe('')
  expect(log.mock.calls[2][0]).toBe('Usage:')
  expect(log.mock.calls[3][0]).toBe(`  $ ${ctx.bin} fake [options]`)
  expect(log.mock.calls[4][0]).toBe('')
  expect(log.mock.calls[5][0]).toBe('Commands:')
})

test('unit:core:commands:help:outputHelp:1', async () => {
  const cmd = createFakeCommand({
    usage: undefined,
    description: undefined,
    alias: ['foo'],
    options: {
      foo: 'string',
      bar: { type: 'string', alias: 'b' },
      bay: { type: 'string', alias: ['ba', 'y'] },
      baz: { type: 'string', description: 'baz option' }
    }
  })
  const ctx = createFakeContext()
  outputHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe('Usage:')
  expect(log.mock.calls[1][0]).toBe(`  $ ${ctx.bin} ${cmd.name} [options]`)
  expect(log.mock.calls[2][0]).toBe('')
  expect(log.mock.calls[3][0]).toBe('Options:')
  expect(log.mock.calls[4][0]).toBe(
    '  --foo            -\n  --bar, -b        -\n  --bay, --ba, -y  -\n  --baz            baz option'
  )
})

test('unit:core:commands:help:outputHelp:2', async () => {
  const cmd = createFakeCommand({ examples: '# test help' })
  const ctx = createFakeContext({ primary: 'foo' })
  outputHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe(cmd.description)
  expect(log.mock.calls[1][0]).toBe('')
  expect(log.mock.calls[2][0]).toBe('Usage:')
  expect(log.mock.calls[3][0]).toBe(`  $ ${ctx.bin} ${cmd.name} [options]`)
  expect(log.mock.calls[4][0]).toBe('')
  expect(log.mock.calls[5][0]).toBe('Examples:')
  expect(log.mock.calls[6][0]).toBe('  # test help')
})

test('unit:core:commands:help:outputHelp:3', async () => {
  const cmd = createFakeCommand({ examples: ['$ [bin] test help'] })
  const ctx = createFakeContext({ primary: 'foo' })
  outputHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe(cmd.description)
  expect(log.mock.calls[1][0]).toBe('')
  expect(log.mock.calls[2][0]).toBe('Usage:')
  expect(log.mock.calls[3][0]).toBe(`  $ ${ctx.bin} ${cmd.name} [options]`)
  expect(log.mock.calls[4][0]).toBe('')
  expect(log.mock.calls[5][0]).toBe('Examples:')
  expect(log.mock.calls[6][0]).toBe(`  $ ${ctx.bin} test help`)
})

test('unit:core:commands:help:outputHelp:4', async () => {
  const cmd = createFakeCommand({ suggestions: 'test help' })
  const ctx = createFakeContext({ primary: 'foo' })
  outputHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe(cmd.description)
  expect(log.mock.calls[1][0]).toBe('')
  expect(log.mock.calls[2][0]).toBe('Usage:')
  expect(log.mock.calls[3][0]).toBe(`  $ ${ctx.bin} ${cmd.name} [options]`)
  expect(log.mock.calls[4][0]).toBe('')
  expect(log.mock.calls[5][0]).toBe('Suggestions:')
  expect(log.mock.calls[6][0]).toBe('  test help')
})

test('unit:core:commands:help:outputHelp:5', async () => {
  const cmd = createFakeCommand({ suggestions: ['$ [bin] test help'] })
  const ctx = createFakeContext({ primary: 'foo' })
  outputHelp(cmd, ctx)
  expect(log.mock.calls[0][0]).toBe(cmd.description)
  expect(log.mock.calls[1][0]).toBe('')
  expect(log.mock.calls[2][0]).toBe('Usage:')
  expect(log.mock.calls[3][0]).toBe(`  $ ${ctx.bin} ${cmd.name} [options]`)
  expect(log.mock.calls[4][0]).toBe('')
  expect(log.mock.calls[5][0]).toBe('Suggestions:')
  expect(log.mock.calls[6][0]).toBe(`  $ ${ctx.bin} test help`)
})
