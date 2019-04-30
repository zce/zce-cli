import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string) =>
  system.run(`node ${join(__dirname, '../../bin/zce')} ${cmd}`)

test('integration:common:version', async () => {
  const output = await runCommand('--version')
  expect(output).toContain(require('../../package.json').version)
})

test('integration:common:help', async () => {
  const output = await runCommand('--help')
  expect(output).toContain('zce')
  expect(output).toContain(require('../../package.json').version)
})
