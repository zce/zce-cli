import * as error from './error'

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log?.mockRestore()
  exit?.mockRestore()
})

test('unit:core:helpers:error:unknownCommand', async () => {
  error.unknownCommand('foo')
  expect(log.mock.calls[0][0]).toBe('Unknown command: `%s`.')
  expect(log.mock.calls[0][1]).toBe('foo')
  expect(log.mock.calls[1][0]).toBe('Type `%s` to view all commands.')
  expect(log.mock.calls[1][1]).toBe('[bin] --help')
  expect(exit.mock.calls[0][0]).toBe(1)
})

test('unit:core:helpers:error:unknownCommand:fallback', async () => {
  error.unknownCommand('foo', 'zce --help')
  expect(log.mock.calls[0][0]).toBe('Unknown command: `%s`.')
  expect(log.mock.calls[0][1]).toBe('foo')
  expect(log.mock.calls[1][0]).toBe('Type `%s` to view all commands.')
  expect(log.mock.calls[1][1]).toBe('zce --help')
  expect(exit.mock.calls[0][0]).toBe(1)
})

test('unit:core:helpers:error:missingArgument', async () => {
  error.missingArgument('foo')
  expect(log.mock.calls[0][0]).toBe('Missing required argument: `<%s>`.')
  expect(log.mock.calls[0][1]).toBe('foo')
  expect(exit.mock.calls[0][0]).toBe(1)
})
