import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string): Promise<string> =>
  system.run(`node ${join(__dirname, '../../bin/zce.js')} ${cmd} --no-color`)

test('integration:common:default', async (): Promise<void> => {
  const output = await runCommand('')
  expect(output.trim()).toBe('')
})

test('integration:common:unknown', async (): Promise<void> => {
  const output = await runCommand('foo')
  expect(output.trim()).toBe(
    'Unknown command: `foo`.\nType `zce --help` to view all commands.'
  )
})

test('integration:common:version', async (): Promise<void> => {
  const output = await runCommand('--version')
  expect(output.trim()).toBe(`zce v${require('../../package.json').version}`)
})

test('integration:common:help', async (): Promise<void> => {
  const output = await runCommand('--help')
  expect(output.trim()).toContain('zce')
  expect(output.trim()).toContain('Usage:')
})
