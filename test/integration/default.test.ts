import { runCommand } from '../utils'

test('integration:default', async (): Promise<void> => {
  const { stdout } = await runCommand()

  expect(stdout).toBe('')
})

test('integration:default:unknown', async (): Promise<void> => {
  try {
    await runCommand('foo')
  } catch (err) {
    expect(err.message).toContain(
      'Unknown command: `foo`.\nType `zce --help` to view all commands.'
    )
  }
})
