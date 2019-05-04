import * as logger from './logger'

let log: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log')
})

afterEach(async () => {
  log && log.mockRestore()
})

test('unit:core:helpers:logger', async () => {
  expect(logger.chalk).toBeTruthy()
  expect(logger.log).toBeTruthy()
  expect(logger.info).toBeTruthy()
  expect(logger.success).toBeTruthy()
  expect(logger.warn).toBeTruthy()
  expect(logger.error).toBeTruthy()
  expect(logger.debug).toBeTruthy()
  expect(logger.pad).toBeTruthy()
  expect(logger.table).toBeTruthy()
  expect(logger.indent).toBeTruthy()
  expect(logger.newline).toBeTruthy()
  expect(logger.divider).toBeTruthy()
  expect(logger.clear).toBeTruthy()
  expect(logger.spin).toBeTruthy()
})

test('unit:core:helpers:logger:chalk', async () => {
  expect(logger.chalk.enabled).toBe(false)
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

  expect(log.mock.calls[0][0]).toBe(
    '↓↓↓ --------------------[ test ]-------------------- ↓↓↓'
  )
  expect(log.mock.calls[1][0]).toBe('foo')
  expect(log.mock.calls[2][0]).toBe(
    '↑↑↑ --------------------[ test ]-------------------- ↑↑↑'
  )
})

test('unit:core:helpers:logger:pad', async () => {
  const output = logger.pad('foo', 5)

  expect(output).toBe('foo  ')
})

test('unit:core:helpers:logger:table', async () => {
  const table1 = logger.table(
    {
      foo: '-',
      barbaz: '-'
    },
    1
  )
  const table2 = logger.table({
    foo: '-',
    bar: '-'
  })

  expect(table1).toBe('foo    -\nbarbaz -')
  expect(table2).toBe('foo                  -\nbar                  -')
})

test('unit:core:helpers:logger:indent', async () => {
  const indent1 = logger.indent('foo')
  const indent2 = logger.indent('foo\nbar')
  const indent3 = logger.indent('foo', 4)

  expect(indent1).toBe('  foo')
  expect(indent2).toBe('  foo\n  bar')
  expect(indent3).toBe('    foo')
})

test('unit:core:helpers:logger:newline', async () => {
  logger.newline()

  expect(log.mock.calls[0][0]).toBe('')
})

test('unit:core:helpers:logger:divider', async () => {
  logger.divider()

  expect(log.mock.calls[0][0]).toBe(
    '--------------------------------------------------------------------------------'
  )
})

test('unit:core:helpers:logger:clear', async () => {
  logger.clear()
  logger.clear('test')
})

test('unit:core:helpers:logger:spin', async () => {
  expect(typeof logger.spin).toBe('function')

  const spinner = logger.spin()

  expect(typeof spinner.stop).toBe('function')

  spinner.stop()
})
