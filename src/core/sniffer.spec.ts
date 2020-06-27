import * as sniffer from './sniffer'
const pkg = require('../../package.json')

let log: jest.SpyInstance
let exit: jest.SpyInstance

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  exit = jest.spyOn(process, 'exit').mockImplementation()
})

afterEach(async () => {
  log && log.mockRestore()
  exit && exit.mockRestore()
})

test('unit:core:sniffer:sniff', async () => {
  sniffer.sniff()
  expect(log).not.toHaveBeenCalled()
})

test('unit:core:sniffer:sniff:version', async () => {
  const originVersion = pkg.engines.node
  pkg.engines.node = '>888'
  sniffer.sniff()
  expect(log.mock.calls[0][0]).toBe('You are using Node.js %s, but this version of %s requires Node.js %s.')
  expect(log.mock.calls[1][0]).toBe('Please upgrade your Node.js version before this operation.')
  expect(exit.mock.calls[0][0]).toBe(1)
  pkg.engines.node = originVersion
})
