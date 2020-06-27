import { runCommand } from './utils'
const pkg = require('../package.json')

jest.setTimeout(8000)

test('integration:version', async () => {
  const { stdout } = await runCommand('version')
  expect(stdout).toBe(`${pkg.name} v${pkg.version}`)
})
