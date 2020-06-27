import * as runner from './runner'
import cmd from '../commands/default'
const pkg = require('../../package.json')

let log: jest.SpyInstance
let exit: jest.SpyInstance
jest.mock('../commands/default')

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
  exit && exit.mockRestore()
})

test('unit:core:runner:extract:1', async () => {
  const [name, argv] = runner.extract(''.split(' '))
  expect(name).toBe('default')
  expect(argv).toEqual([])
})

test('unit:core:runner:extract:2', async () => {
  const [name, argv] = runner.extract('foo'.split(' '))
  expect(name).toBe('foo')
  expect(argv).toEqual([])
})

test('unit:core:runner:extract:3', async () => {
  const [name, argv] = runner.extract('foo bar'.split(' '))
  expect(name).toBe('foo')
  expect(argv).toEqual(['bar'])
})

test('unit:core:runner:extract:4', async () => {
  const [name, argv] = runner.extract('foo --help'.split(' '))
  expect(name).toBe('foo')
  expect(argv).toEqual(['--help'])
})

// test('unit:core:runner:extract:4', async () => {
//   const [name, argv] = runner.extract('foo --help'.split(' '))
//   expect(name).toBe('help')
//   expect(argv).toEqual(['foo', '--help'])
// })

test('unit:core:runner:extract:5', async () => {
  const [name, argv] = runner.extract('--help'.split(' '))
  expect(name).toBe('help')
  expect(argv).toEqual(['--help'])
})

test('unit:core:runner:extract:5', async () => {
  const [name, argv] = runner.extract('--version'.split(' '))
  expect(name).toBe('version')
  expect(argv).toEqual(['--version'])
})

test('unit:core:runner:extract:6', async () => {
  const [name, argv] = runner.extract('--foo'.split(' '))
  expect(name).toBe('default')
  expect(argv).toEqual(['--foo'])
})

test('unit:core:runner:run:default', async () => {
  const original = process.argv
  process.argv = []
  await runner.run()
  const mockedAction = cmd.action as unknown as jest.SpyInstance
  expect(mockedAction).toHaveBeenCalled()
  expect(mockedAction.mock.calls[0][0].bin).toBe(Object.keys(pkg.bin)[0])
  expect(mockedAction.mock.calls[0][0].primary).toBe(undefined)
  expect(mockedAction.mock.calls[0][0].secondary).toBe(undefined)
  expect(mockedAction.mock.calls[0][0].thirdly).toBe(undefined)
  expect(mockedAction.mock.calls[0][0].fourthly).toBe(undefined)
  expect(mockedAction.mock.calls[0][0].extras).toEqual([])
  expect(mockedAction.mock.calls[0][0].inputs).toEqual([])
  expect(mockedAction.mock.calls[0][0].options).toEqual({})
  expect(mockedAction.mock.calls[0][0].pkg.name).toBe(pkg.name)
  process.argv = original
})

test('unit:core:runner:run:version', async () => {
  await runner.run(['version'])
  expect(log.mock.calls[0][0]).toBe(`${pkg.name} v${pkg.version}`)
})

test('unit:core:runner:run:help', async () => {
  await runner.run(['help'])
  expect(log.mock.calls[0][0]).toBe(pkg.description)
})

test('unit:core:runner:run:help:command', async () => {
  await runner.run(['help', 'version'])
  expect(log.mock.calls[0][0]).toBe('output the version number.')
})

test('unit:core:runner:run:unknown', async () => {
  await runner.run(['faker'])
  expect(log.mock.calls[0][0]).toBe('Unknown command: `%s`.')
  expect(log.mock.calls[0][1]).toBe('faker')
  expect(log.mock.calls[1][0]).toBe('Type `%s` to view all commands.')
  expect(log.mock.calls[1][1]).toBe(`${Object.keys(pkg.bin)[0]} --help`)
  expect(exit.mock.calls[0][0]).toBe(1)
})
