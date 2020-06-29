import * as core from '.'

test('unit:core', async () => {
  expect(typeof core.file).toBe('object')
  expect(typeof core.http).toBe('object')
  expect(typeof core.config).toBe('object')
  expect(typeof core.prompt).toBe('object')
  expect(typeof core.system).toBe('object')
  expect(typeof core.logger).toBe('object')
  expect(typeof core.template).toBe('object')
  expect(typeof core.unknownCommand).toBe('function')
  expect(typeof core.missingArgument).toBe('function')
  expect(typeof core.sniff).toBe('function')
  expect(typeof core.run).toBe('function')
})
