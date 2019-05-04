import * as loader from '../../../src/core/loader'

test('unit:core:loader', async (): Promise<void> => {
  expect(loader.userCommands).toBeTruthy()
  expect(loader.coreCommands).toBeTruthy()
  expect(loader.load).toBeTruthy()
})

test('unit:core:loader:load:help', async (): Promise<void> => {
  const cmd = await loader.load('help')

  expect(cmd.name).toBe('help')
})

test('unit:core:loader:load:version', async (): Promise<void> => {
  const cmd = await loader.load('version')

  expect(cmd.name).toBe('version')
})

test('unit:core:loader:load:user', async (): Promise<void> => {
  const cmd = await loader.load('hello')

  expect(cmd.name).toBe('hello')
})

test('unit:core:loader:load:unknown', async (): Promise<void> => {
  const cmd = await loader.load('unknown')

  expect(cmd.name).toBe('default')
})
