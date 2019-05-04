import * as runner from '../../../src/core/runner'
import { sinon } from '../../utils'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version } = require('../../../package.json')

let spy: sinon.SinonSpy

beforeEach(async () => {
  spy = sinon.spy(console, 'log')
})

afterEach(async () => {
  spy.restore()
})

test('unit:core:runner', async (): Promise<void> => {
  expect(runner.run).toBeTruthy()
})

test('unit:core:runner:run', async (): Promise<void> => {
  await runner.run()

  expect(spy.notCalled).toBe(true)
})

test('unit:core:runner:run:version', async (): Promise<void> => {
  await runner.run(['version'])

  expect(spy.args[0][0]).toBe(`${name} v${version}`)
})

test('unit:core:runner:run:hello', async (): Promise<void> => {
  await runner.run(['hello', 'foo'])
  expect(spy.args[0][0]).toBe('Hey! foo~')
})

test('unit:core:runner:run:unknown', async (): Promise<void> => {
  const stub = sinon.stub(process, 'exit')

  await runner.run(['unknown'])

  expect(spy.args[0][0]).toBe('Unknown command: `%s`.')
  expect(spy.args[0][1]).toBe('unknown')
  expect(spy.args[1][0]).toBe('Type `%s` to view all commands.')
  expect(spy.args[1][1]).toBe('zce --help')
  expect(stub.args[0][0]).toBe(1)

  stub.restore()
})
