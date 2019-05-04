import { runCommand } from '../utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../../package.json')

test('integration:version', async (): Promise<void> => {
  const { stdout } = await runCommand('version')

  expect(stdout).toBe(`${name} v${version}`)
})
