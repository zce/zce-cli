import { runCommand } from './utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../package.json')

jest.setTimeout(8000)

test('integration:version', async () => {
  const { stdout } = await runCommand('version')

  expect(stdout).toBe(`${name} v${version}`)
})
