import * as loader from './loader'

test('unit:core:loader', async () => {
  expect(loader.userCommands).toBeTruthy()
  expect(loader.coreCommands).toBeTruthy()
  expect(loader.load).toBeTruthy()
})

test('unit:core:loader:load:help', async () => {
  const cmd = await loader.load('help')

  expect(cmd.name).toBe('help')
})

test('unit:core:loader:load:version', async () => {
  const cmd = await loader.load('version')

  expect(cmd.name).toBe('version')
})

test('unit:core:loader:load:user', async () => {
  const cmd = await loader.load('hello')

  expect(cmd.name).toBe('hello')
})

test('unit:core:loader:load:unknown', async () => {
  const cmd = await loader.load('unknown')

  expect(cmd.name).toBe('default')
})
