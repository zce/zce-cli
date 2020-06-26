import * as sniffer from './sniffer'
import { engines } from '../../package.json'

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log')
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
  exit && exit.mockRestore()
})

test('unit:core:sniffer', async () => {
  expect(sniffer.sniff).toBeTruthy()
})

test('unit:core:sniffer:sniff', async () => {
  sniffer.sniff()

  expect(log).not.toHaveBeenCalled()
})

test('unit:core:sniffer:sniff:version', async () => {
  const originVersion = engines.node
  engines.node = '>888.8.8'

  sniffer.sniff()

  expect(log.mock.calls[0][0]).toBe('You are using Node.js %s, but this version of %s requires Node.js %s.')
  expect(log.mock.calls[1][0]).toBe('Please upgrade your Node.js version before this operation.')
  expect(exit.mock.calls[0][0]).toBe(1)

  engines.node = originVersion
})
