import * as helpers from '.'

test('unit:core:helpers', async () => {
  expect(helpers.file).toBeTruthy()
  expect(helpers.http).toBeTruthy()
  expect(helpers.system).toBeTruthy()
  expect(helpers.logger).toBeTruthy()
  expect(helpers.template).toBeTruthy()
})
