import * as logger from './logger'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
})

test('unit:core:helpers:logger', async () => {
  expect(typeof logger.color).toBe('function')
  expect(typeof logger.log).toBe('function')
  expect(typeof logger.info).toBe('function')
  expect(typeof logger.success).toBe('function')
  expect(typeof logger.warn).toBe('function')
  expect(typeof logger.error).toBe('function')
  expect(typeof logger.debug).toBe('function')
  expect(typeof logger.table).toBe('function')
  expect(typeof logger.indent).toBe('function')
  expect(typeof logger.newline).toBe('function')
  expect(typeof logger.divider).toBe('function')
  expect(typeof logger.clear).toBe('function')
  expect(typeof logger.spin).toBe('function')
})

test('unit:core:helpers:logger:chalk', async () => {
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

test('unit:core:helpers:logger:table', async () => {
  const table1 = logger.table({ foo: '-', barbaz: '-' }, 1)
  expect(table1).toBe('foo    -\nbarbaz -')

  const table2 = logger.table({ foo: '-', bar: '-' })
  expect(table2).toBe('foo                  -\nbar                  -')
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
  logger.clear()
  logger.clear('test')
  expect(log).not.toHaveBeenCalled()
})

test('unit:core:helpers:logger:spin', async () => {
  const spinner = logger.spin()
  expect(typeof spinner.stop).toBe('function')
  spinner.stop()
})
