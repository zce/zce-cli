import { runCommand } from './utils'

jest.setTimeout(8000)

test('integration:hello:default', async () => {
  try {
    await runCommand('hello')
  } catch (err) {
    expect(err.message).toContain('Missing required argument: `<name>`.')
  }
})

test('integration:hello:name', async () => {
  const { stdout } = await runCommand(['hello', 'zce'])

  expect(stdout).toBe('Hey! zce~')
})
