import { runCommand } from './utils'

jest.setTimeout(8000)

test('integration:help', async () => {
  const { stdout } = await runCommand('help')

  expect(stdout).toContain('Usage:')
  expect(stdout).toContain('zce <command> [options]')
  expect(stdout).toContain('Commands:')
  expect(stdout).toContain('help')
  expect(stdout).toContain('version')
  expect(stdout).toContain('hello (hi)')
})

test('integration:help:sub-command', async () => {
  const { stdout } = await runCommand(['help', 'version'])

  expect(stdout).toContain('output the version number.')
  expect(stdout).toContain('Usage:')
  expect(stdout).toContain('$ zce --version')
})
