import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string): Promise<string> =>
  system.run(`node ${join(__dirname, '../../bin/zce.js')} ${cmd} --no-color`)

test('integration:hello:default', async (): Promise<void> => {
  const output = await runCommand('hello')
  expect(output.trim()).toBe('Hey world~')
})

test('integration:hello:name', async (): Promise<void> => {
  const output = await runCommand('hello --name zce')
  expect(output.trim()).toBe('Hey zce~')
})
