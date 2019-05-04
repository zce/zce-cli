import * as logger from '../../../../src/core/helpers/logger'
import { sinon } from '../../../utils'

let spy: sinon.SinonSpy

beforeEach(async () => {
  spy = sinon.spy(console, 'log')
})

afterEach(async () => {
  spy.restore()
})

test('unit:core:helpers:logger', async (): Promise<void> => {
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

test('unit:core:helpers:logger:chalk', async (): Promise<void> => {
  expect(logger.chalk.enabled).toBe(false)
})

test('unit:core:helpers:logger:log', async (): Promise<void> => {
  logger.log('foo')

  expect(spy.args[0][0]).toBe('foo')
})

test('unit:core:helpers:logger:info', async (): Promise<void> => {
  logger.info('foo %s', 'bar')

  expect(spy.args[0][0]).toBe('foo %s')
  expect(spy.args[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:success', async (): Promise<void> => {
  logger.success('foo %s', 'bar')

  expect(spy.args[0][0]).toBe('foo %s')
  expect(spy.args[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:warn', async (): Promise<void> => {
  logger.warn('foo %s', 'bar')

  expect(spy.args[0][0]).toBe('foo %s')
  expect(spy.args[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:error', async (): Promise<void> => {
  logger.error('foo %s', 'bar')

  expect(spy.args[0][0]).toBe('foo %s')
  expect(spy.args[0][1]).toBe('bar')
})

test('unit:core:helpers:logger:debug', async (): Promise<void> => {
  logger.debug('foo', 'test')

  expect(spy.args[0][0]).toBe(
    '↓↓↓ --------------------[ test ]-------------------- ↓↓↓'
  )
  expect(spy.args[1][0]).toBe('foo')
  expect(spy.args[2][0]).toBe(
    '↑↑↑ --------------------[ test ]-------------------- ↑↑↑'
  )
})

test('unit:core:helpers:logger:pad', async (): Promise<void> => {
  const output = logger.pad('foo', 5)

  expect(output).toBe('foo  ')
})

test('unit:core:helpers:logger:table', async (): Promise<void> => {
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

test('unit:core:helpers:logger:indent', async (): Promise<void> => {
  const indent1 = logger.indent('foo')
  const indent2 = logger.indent('foo\nbar')
  const indent3 = logger.indent('foo', 4)

  expect(indent1).toBe('  foo')
  expect(indent2).toBe('  foo\n  bar')
  expect(indent3).toBe('    foo')
})

test('unit:core:helpers:logger:newline', async (): Promise<void> => {
  logger.newline()

  expect(spy.args[0][0]).toBe('')
})

test('unit:core:helpers:logger:divider', async (): Promise<void> => {
  logger.divider()

  expect(spy.args[0][0]).toBe(
    '--------------------------------------------------------------------------------'
  )
})

test('unit:core:helpers:logger:clear', async (): Promise<void> => {
  logger.clear()
})

test('unit:core:helpers:logger:spin', async (): Promise<void> => {
  expect(typeof logger.spin).toBe('function')

  const spinner = logger.spin()

  expect(typeof spinner.stop).toBe('function')

  spinner.stop()
})
