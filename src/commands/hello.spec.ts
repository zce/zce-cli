import command from './hello'
import { createFakeContext } from '../../test/utils'

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
  exit && exit.mockRestore()
})

test('unit:commands:hello', async () => {
  expect(command.name).toBe('hello')
  expect(command.usage).toBe('hello <name> [options]')
  expect(command.description).toBe('hello command')
  expect(command.alias).toBe('hi')
  expect(command.options).toBeTruthy()
  expect(command.examples).toBeTruthy()
  expect(typeof command.action).toBe('function')
})

test('unit:commands:hello:action:1', async () => {
  const ctx = createFakeContext()
  await command.action(ctx)
  expect(log.mock.calls[0][0]).toBe('Missing required argument: `<%s>`.')
  expect(log.mock.calls[0][1]).toBe('name')
})

test('unit:commands:hello:action:2', async () => {
  const ctx = createFakeContext({ primary: 'zce' })
  await command.action(ctx)
  expect(log).not.toHaveBeenCalled()
})

test('unit:commands:hello:action:3', async () => {
  const ctx = createFakeContext({ primary: 'zce', options: { lang: 'en' } })
  await command.action(ctx)
  expect(log.mock.calls[0][0]).toBe('Hey! zce~')
})

test('unit:commands:hello:action:4', async () => {
  const ctx = createFakeContext({ primary: 'zce', options: { lang: 'zh', debug: true } })
  await command.action(ctx)
  expect(log.mock.calls[0][0]).toBe('嘿！zce~')
  expect(log.mock.calls[1][0]).toBe('↓↓↓ --------------------[ DEBUG ]-------------------- ↓↓↓')
  expect(log.mock.calls[2][0]).toBe(ctx)
  expect(log.mock.calls[3][0]).toBe('↑↑↑ --------------------[ DEBUG ]-------------------- ↑↑↑')
})
