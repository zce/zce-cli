import * as core from '../../../src/core'

test('unit:core:index', async (): Promise<void> => {
  expect(core.missingArgument).toBeTruthy()
  expect(core.unknownCommand).toBeTruthy()
  expect(core.template).toBeTruthy()
  expect(core.logger).toBeTruthy()
  expect(core.run).toBeTruthy()
})
