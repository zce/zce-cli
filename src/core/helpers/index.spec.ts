import * as helpers from '.'

test('unit:core:helpers', async () => {
  expect(typeof helpers.file).toBe('object')
  expect(typeof helpers.http).toBe('object')
  expect(typeof helpers.system).toBe('object')
  expect(typeof helpers.config).toBe('object')
  expect(typeof helpers.logger).toBe('object')
  expect(typeof helpers.template).toBe('object')
  expect(typeof helpers.ware).toBe('function')
  expect(typeof helpers.prompt).toBe('function')
  expect(typeof helpers.unknownCommand).toBe('function')
  expect(typeof helpers.missingArgument).toBe('function')
})
