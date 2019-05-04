import * as core from '.'

test('unit:core:index', async () => {
  expect(core.missingArgument).toBeTruthy()
  expect(core.unknownCommand).toBeTruthy()
  expect(core.template).toBeTruthy()
  expect(core.logger).toBeTruthy()
  expect(core.run).toBeTruthy()
})
