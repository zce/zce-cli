import * as logger from './logger'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log?.mockRestore()
})

test('unit:core:helpers:logger:color', async () => {
  expect(typeof logger.color).toBe('function')
  expect(logger.color.level).toBe(0)
})

test('unit:core:helpers:logger:log', async () => {
  logger.log('foo')
  expect(log.mock.calls[0][0]).toBe('foo')
})

test('unit:core:helpers:logger:info', async () => {
  logger.info('foo %s', 'bar')
  expect(log.mock.calls[0][0]).toBe('foo %s')
  expect(log.mock.calls[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:success', async () => {
  logger.success('foo %s', 'bar')
  expect(log.mock.calls[0][0]).toBe('foo %s')
  expect(log.mock.calls[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:warn', async () => {
  logger.warn('foo %s', 'bar')
  expect(log.mock.calls[0][0]).toBe('foo %s')
  expect(log.mock.calls[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:error', async () => {
  logger.error('foo %s', 'bar')
  expect(log.mock.calls[0][0]).toBe('foo %s')
  expect(log.mock.calls[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:debug', async () => {
  logger.debug('foo', 'test')
  expect(log.mock.calls[0][0]).toBe('↓↓↓ --------------------[ test ]-------------------- ↓↓↓')
  expect(log.mock.calls[1][0]).toBe('foo')
  expect(log.mock.calls[2][0]).toBe('↑↑↑ --------------------[ test ]-------------------- ↑↑↑')
})

// test('unit:core:helpers:logger:table', async () => {
//   const table1 = logger.table({ foo: '-', barbaz: '-' }, 1)
//   expect(table1).toBe('foo    -\nbarbaz -')

//   const table2 = logger.table({ foo: '-', bar: '-' })
//   expect(table2).toBe('foo                  -\nbar                  -')
// })

test('unit:core:helpers:logger:table:1', async () => {
  logger.table([
    ['foo', 123],
    ['barbarbarbar', 'baz']
  ])
  expect(log.mock.calls[0][0]).toBe('foo           123\nbarbarbarbar  baz')
})

test('unit:core:helpers:logger:table:2', async () => {
  logger.table({ foo: 123, bar: 'baz' }, 12, 2)
  expect(log.mock.calls[0][0]).toBe('  foo           123\n  bar           baz')
})

test('unit:core:helpers:logger:indent', async () => {
  const indent1 = logger.indent('foo')
  expect(indent1).toBe('  foo')

  const indent2 = logger.indent('foo\nbar')
  expect(indent2).toBe('  foo\n  bar')

  const indent3 = logger.indent('foo', 4)
  expect(indent3).toBe('    foo')
})

test('unit:core:helpers:logger:newline', async () => {
  logger.newline()

  expect(log.mock.calls[0][0]).toBe('')
})

test('unit:core:helpers:logger:divider', async () => {
  logger.divider()

  expect(log.mock.calls[0][0]).toBe('--------------------------------------------------------------------------------')
})

test('unit:core:helpers:logger:clear', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()

  logger.clear()
  logger.clear('test')
  expect(clear).toBeCalledTimes(2)
  expect(log).toBeCalledTimes(1)

  clear.mockRestore()
})

test('unit:core:helpers:logger:spin', async () => {
  const spinner = logger.spin()
  expect(typeof spinner.stop).toBe('function')
  spinner.stop()
})
