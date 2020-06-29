import * as config from './config'
import path from 'path'
const pkg = require('../../package.json')

test('unit:core:helpers:config', async () => {
  const conf1 = await config.get()
  expect(conf1).toEqual({})

  pkg.name = 'fakkkkkker'
  pkg.bin = './bin/foo.js'
  const conf2 = await config.get()
  expect(conf2).toEqual({})
})

test('unit:core:helpers:config:name', async () => {
  const conf = await config.get('fakkkkkker')
  expect(conf).toEqual({})
})

test('unit:core:helpers:config:from', async () => {
  const conf = await config.get('test', path.join(__dirname, '../../../test/fixtures'))
  expect(conf).toEqual({ foo: 'bar' })
})

test('unit:core:helpers:config:options', async () => {
  const conf = await config.get('fakkkkkker', process.cwd(), { cache: false })
  expect(conf).toEqual({})
})
