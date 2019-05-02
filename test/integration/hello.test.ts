import { runCommand } from '../utils'

test('integration:hello:default', async (): Promise<void> => {
  const output = await runCommand('hello')
  expect(output.trim()).toBe('Hey world~')
})

test('integration:hello:name', async (): Promise<void> => {
  const output = await runCommand('hello --name zce')
  expect(output.trim()).toBe('Hey zce~')
})
