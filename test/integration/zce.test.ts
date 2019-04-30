import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string): Promise<string> =>
  system.run(`node ${join(__dirname, '../../bin/zce')} ${cmd}`)

test('integration:zce', async (): Promise<void> => {
  const output = await runCommand('')
  expect(output).toBe('')
})
