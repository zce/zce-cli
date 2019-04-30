import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string) =>
  system.run(`node ${join(__dirname, '../../bin/zce')} ${cmd}`)

test('integration:zce-command', async () => {
  const output = await runCommand()
  expect(output).toBe('')
})
