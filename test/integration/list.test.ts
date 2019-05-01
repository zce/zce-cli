import { join } from 'path'
import { system } from 'gluegun'

const runCommand = async (cmd?: string): Promise<string> =>
  system.run(`node ${join(__dirname, '../../bin/zce.js')} ${cmd} --no-color`)

// beforeEach(() => jest.setTimeout(10000))

test('integration:list:default', async (): Promise<void> => {
  const output = await runCommand('list')
  expect(output.trim()).toContain("Available official's templates:")
})

test('integration:list:username', async (): Promise<void> => {
  const output = await runCommand('list fake-users')
  expect(output.trim()).toContain("Available fake-users's templates:")
})

// test('integration:list:short', async (): Promise<void> => {
//   const output = await runCommand('list fake-users -s')
//   expect(output.trim()).toBe('→ fake-users/demo')
// })

// test('integration:list:json', async (): Promise<void> => {
//   const output = await runCommand('list fake-users -j')
//   expect(output.trim()).toBe('[{"name":"fake-users/demo","description":null}]')
// })

test('integration:list:empty', async (): Promise<void> => {
  const output = await runCommand('list ghost')
  expect(output.trim()).toBe('No available templates.')
})
