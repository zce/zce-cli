const test = require('ava')

const { util } = require('../../../lib/common')

const os = require('os')
const path = require('path')

test('common:util#existsDir', async t => {
  t.true(await util.existsDir(__dirname))
  t.false(await util.existsDir(path.join(__dirname, 'fake-dir')))
})

test('common:util#isEmptyDir', async t => {
  t.false(await util.isEmptyDir(__dirname))
  await t.throws(util.isEmptyDir(path.join(__dirname, 'fake-dir')))
})

test('common:util#tildify', t => {
  t.is(util.tildify(path.join(os.homedir(), 'foo')), '~/foo')
  t.is(util.tildify(os.homedir()), '~')
  t.is(util.tildify('/foo'), '/foo')
})

test('common:util#untildify', t => {
  t.is(util.untildify('~/foo'), path.join(os.homedir(), 'foo'))
  t.is(util.untildify('~'), os.homedir())
  t.is(util.untildify('/foo'), '/foo')
})

test('common:util#md5', t => {
  t.is(util.md5('zce'), 'f1963aa09931b5dade50485239cc40bc')
})
