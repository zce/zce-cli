import * as error from '../../../src/core/error'
import { sinon } from '../../utils'

let stub: sinon.SinonStub
let spy: sinon.SinonSpy

beforeEach(async () => {
  stub = sinon.stub(process, 'exit')
  spy = sinon.spy(console, 'log')
})

afterEach(async () => {
  stub.restore()
  spy.restore()
})

test('unit:core:error', async (): Promise<void> => {
  expect(error.unknownCommand).toBeTruthy()
  expect(error.missingArgument).toBeTruthy()
})

test('unit:core:error:unknownCommand', async (): Promise<void> => {
  error.unknownCommand('foo')

  expect(spy.args[0][0]).toBe('Unknown command: `%s`.')
  expect(spy.args[0][1]).toBe('foo')
  expect(spy.args[1][0]).toBe('Type `%s` to view all commands.')
  expect(spy.args[1][1]).toBe('[bin] --help')
  expect(stub.args[0][0]).toBe(1)
})

test('unit:core:error:unknownCommand:fallback', async (): Promise<void> => {
  error.unknownCommand('foo', 'zce --help')

  expect(spy.args[0][0]).toBe('Unknown command: `%s`.')
  expect(spy.args[0][1]).toBe('foo')
  expect(spy.args[1][0]).toBe('Type `%s` to view all commands.')
  expect(spy.args[1][1]).toBe('zce --help')
  expect(stub.args[0][0]).toBe(1)
})

test('unit:core:error:missingArgument', async (): Promise<void> => {
  error.missingArgument('foo')

  expect(spy.args[0][0]).toBe('Missing required argument: `<%s>`.')
  expect(spy.args[0][1]).toBe('foo')
  expect(stub.args[0][0]).toBe(1)
})
