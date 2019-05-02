import { runCommand } from '../utils'

test('integration:init:default', async (): Promise<void> => {
  const output = await runCommand('init nm demo')
  expect(output.trim()).toBe('Generate a new project from a template')

  // const content = filesystem.read('models/foo-model.ts')
  // expect(content.trim()).toBe(`module.exports = {\n  name: 'foo'\n}`)

  // // cleanup artifact
  // filesystem.remove('models')
})
