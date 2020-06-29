import * as helpers from '.'

test('unit:core:helpers', async () => {
  expect(typeof helpers.file).toBe('object')
  expect(typeof helpers.http).toBe('object')
  expect(typeof helpers.config).toBe('object')
  expect(typeof helpers.prompt).toBe('object')
  expect(typeof helpers.system).toBe('object')
  expect(typeof helpers.logger).toBe('object')
  expect(typeof helpers.template).toBe('object')
})
