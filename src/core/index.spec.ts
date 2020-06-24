import * as core from '.'

test('unit:core:index', async () => {
  expect(core.run).toBeTruthy()
  expect(core.file).toBeTruthy()
  expect(core.http).toBeTruthy()
  expect(core.system).toBeTruthy()
  expect(core.logger).toBeTruthy()
  expect(core.template).toBeTruthy()
  expect(core.unknownCommand).toBeTruthy()
  expect(core.missingArgument).toBeTruthy()
})
