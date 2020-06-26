import * as system from './system'

test('unit:core:helpers:system', async () => {
  expect(typeof system.exec).toBe('function')
})
