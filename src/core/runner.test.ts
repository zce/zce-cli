import * as runner from './runner'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../../package.json')

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

test('unit:core:runner', async () => {
  expect(runner.run).toBeTruthy()
})

test('unit:core:runner:run', async () => {
  await runner.run()

  expect(log).not.toHaveBeenCalled()
})

test('unit:core:runner:run:version', async () => {
  await runner.run(['version'])

  expect(log.mock.calls[0][0]).toBe(`${name} v${version}`)
})

test('unit:core:runner:run:hello', async () => {
  await runner.run(['hello', 'foo'])
  expect(log.mock.calls[0][0]).toBe('Hey! foo~')
})

test('unit:core:runner:run:unknown', async () => {
  await runner.run(['unknown'])

  expect(log.mock.calls[0][0]).toBe('Unknown command: `%s`.')
  expect(log.mock.calls[0][1]).toBe('unknown')
  expect(log.mock.calls[1][0]).toBe('Type `%s` to view all commands.')
  expect(log.mock.calls[1][1]).toBe('zce --help')
  expect(exit.mock.calls[0][0]).toBe(1)
})
