import * as helpers from '../../../../src/core/helpers'

test('unit:core:helpers', async (): Promise<void> => {
  expect(helpers.template).toBeTruthy()
  expect(helpers.logger).toBeTruthy()
})
