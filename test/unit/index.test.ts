import cli from '../../src'

test('unit:cli:start', async (): Promise<void> => {
  const toolbox = await cli([])
  expect(toolbox).toBeTruthy()
})
