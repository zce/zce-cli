import { runCommand } from './utils'
import { description } from '../package.json'

jest.setTimeout(8000)

test('integration:help', async () => {
  const { stdout } = await runCommand('help')

  expect(stdout).toContain(description)
  expect(stdout).toContain('Usage:')
  expect(stdout).toContain('zce <command> [options]')
  expect(stdout).toContain('Commands:')
  expect(stdout).toContain('hello(hi)')
  expect(stdout).toContain('help')
  expect(stdout).toContain('version')
})

test('integration:help:sub-command', async () => {
  const { stdout } = await runCommand(['help', 'hello'])

  expect(stdout).toContain('Hello command')
  expect(stdout).toContain('Usage:')
  expect(stdout).toContain('zce hello <name> [options]')
  expect(stdout).toContain('Options:')
  expect(stdout).toContain('--lang, -l')
  expect(stdout).toContain('--debug, -d')
})
