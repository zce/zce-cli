import cli from '../../src/index'

test('unit:cli:start', async () => {
  const toolbox = await cli()
  expect(toolbox).toBeTruthy()
})

test('unit:cli:meta:version', async () => {
  const toolbox = await cli()
  expect(toolbox.meta.version()).toBe('0.0.0')
})
