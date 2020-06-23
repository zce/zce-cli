import { runCommand } from './utils'

import { name, version } from '../package.json'

jest.setTimeout(8000)

test('integration:version', async () => {
  const { stdout } = await runCommand('version')

  expect(stdout).toBe(`${name} v${version}`)
})
