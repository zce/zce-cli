const test = require('ava')

const { app } = require('../../../lib/common')

const os = require('os')
const path = require('path')

const pkg = require('../../../package')

const binName = Object.keys(pkg.bin)[0] + '-test'

test('common:app:getName', t => {
  t.is(app.getName(), binName)

  const bin = pkg.bin
  pkg.bin = {}

  t.is(app.getName(), 'zce-test')

  pkg.bin = bin
})

test('common:app:getVersion', t => {
  t.is(app.getVersion(), pkg.version)
})

test('common:app:getDataPath', t => {
  const expected1 = path.join(os.homedir(), '.config', binName)
  t.is(app.getDataPath(), expected1)

  const expected2 = path.join(os.homedir(), '.config', binName, 'test')
  t.is(app.getDataPath('test'), expected2)

  const expected3 = path.join(os.homedir(), '.config', binName, 'unit/test')
  t.is(app.getDataPath('unit', 'test'), expected3)
})

test('common:app:getTempPath', t => {
  const expected1 = path.join(os.tmpdir(), binName)
  t.is(app.getTempPath(), expected1)

  const expected2 = path.join(os.tmpdir(), binName, 'test')
  t.is(app.getTempPath('test'), expected2)

  const expected3 = path.join(os.tmpdir(), binName, 'unit/test')
  t.is(app.getTempPath('unit', 'test'), expected3)
})
