import command from './default'
import { createFakeContext } from '../../../test/utils'
import { description } from '../../../package.json'

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log')
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
  exit && exit.mockRestore()
})

test('unit:core:commands:default', async () => {
  expect(command.name).toBe('default')
  expect(command.usage).toBe('<command> [options]')
  expect(command.description).toBe(description)
  expect(command.hidden).toBe(true)
  expect(typeof command.action).toBe('function')
})

test('unit:core:commands:default:action', async () => {
  const ctx1 = createFakeContext()
  await command.action(ctx1)

  const ctx2 = createFakeContext({ primary: 'foo' })
  await command.action(ctx2)

  expect(log).toHaveBeenCalledTimes(2)
  expect(log.mock.calls[0][0]).toBe('Unknown command: `%s`.')
  expect(log.mock.calls[0][1]).toBe('foo')
  expect(log.mock.calls[1][0]).toBe('Type `%s` to view all commands.')
  expect(log.mock.calls[1][1]).toBe('zce --help')
  expect(exit).toHaveBeenCalledTimes(1)
  expect(exit.mock.calls[0][0]).toBe(1)
})
