import * as runner from './runner'

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

// test('unit:core:runner:run', async () => {
//   process.argv.length = 0

//   await runner.run()

//   expect(log).not.toHaveBeenCalled()
// })

// test('unit:core:runner:run:version', async () => {
//   await runner.run(['version'])

//   expect(log.mock.calls[0][0]).toBe(`${name} v${version}`)
// })

// test('unit:core:runner:run:hello', async () => {
//   await runner.run(['hello', 'foo'])
//   expect(log.mock.calls[0][0]).toBe('Hey! foo~')
// })

// test('unit:core:runner:run:unknown', async () => {
//   await runner.run(['unknown'])

//   expect(log.mock.calls[0][0]).toBe('Unknown command: `%s`.')
//   expect(log.mock.calls[0][1]).toBe('unknown')
//   expect(log.mock.calls[1][0]).toBe('Type `%s` to view all commands.')
//   expect(log.mock.calls[1][1]).toBe('zce --help')
//   expect(exit.mock.calls[0][0]).toBe(1)
// })
