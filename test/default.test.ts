import { runCommand } from './utils'

test('integration:default', async () => {
  const { stdout } = await runCommand()

  expect(stdout).toBe('')
})

test('integration:default:unknown', async () => {
  try {
    await runCommand('foo')
  } catch (err) {
    expect(err.message).toContain(
      'Unknown command: `foo`.\nType `zce --help` to view all commands.'
    )
  }
})
