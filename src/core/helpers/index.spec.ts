import * as helpers from '.'

test('unit:core:helpers', async () => {
  expect(helpers.template).toBeTruthy()
  expect(helpers.logger).toBeTruthy()
})
