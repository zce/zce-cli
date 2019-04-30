import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string): Promise<string> =>
  system.run(`node ${join(__dirname, '../../bin/zce')} ${cmd}`)

test('integration:init', async (): Promise<void> => {
  const output = await runCommand('init nm demo')
  expect(output).toContain('Generate a new project from a template')

  // const content = filesystem.read('models/foo-model.ts')
  // expect(content).toContain(`module.exports = {\n  name: 'foo'\n}`)

  // // cleanup artifact
  // filesystem.remove('models')
})
