/**
 * common:util
 */

const test = require('ava')
const { util } = require('../../../lib/common')

/**
 * test dependencies
 */
const os = require('os')
const path = require('path')
const mockStdio = require('../../tool/mock-stdio')
const pkg = require('../../../package')

const home = os.homedir()
const tmp = os.tmpdir()

test('common:util:exists', async t => {
  t.true(await util.exists(__dirname))
  t.true(await util.exists(__filename))
  t.false(await util.exists(path.join(__dirname, 'fake-dir')))
  t.false(await util.exists(path.join(__dirname, 'fake-file.txt')))
})

test('common:util:isDirectory', async t => {
  t.true(await util.isDirectory(__dirname))
  t.false(await util.isDirectory(__filename))
  await t.throws(
    util.isDirectory(path.join(__dirname, 'fake-dir')),
    /no such file or directory/
  )
})

test('common:util:isFile', async t => {
  t.true(await util.isFile(__filename))
  t.false(await util.isFile(__dirname))
  await t.throws(
    util.isFile(path.join(__dirname, 'fake-file.txt')),
    /no such file or directory/
  )
})

test('common:util:isEmpty', async t => {
  t.false(await util.isEmpty(__dirname))
  await t.throws(
    util.isEmpty(path.join(__dirname, 'fake-dir')),
    /no such file or directory/
  )
})

test('common:util:mkdirp&rimraf', async t => {
  const tempFilename = path.join(tmp, 'zce-test/util/rimraf')
  await util.mkdirp(tempFilename)
  await util.rimraf(tempFilename)
  t.false(await util.exists(tempFilename))
})

test('common:util:tildify', t => {
  t.is(util.tildify(path.join(home, 'foo')), path.normalize('~/foo'))
  t.is(util.tildify(home), '~')
  t.is(util.tildify(home + 'foo'), home + 'foo')
  t.is(util.tildify('/foo'), path.normalize('/foo'))
})

test('common:util:untildify', t => {
  t.is(util.untildify('~/foo'), path.join(home, 'foo'))
  t.is(util.untildify('~'), home)
  t.is(util.untildify('/foo'), path.normalize('/foo'))
})

test('common:util:getDataPath', t => {
  const expected1 = path.join(home, '.config/zce-test')
  t.is(util.getDataPath(), expected1)

  const expected2 = path.join(home, '.config/zce-test/test')
  t.is(util.getDataPath('test'), expected2)

  const expected3 = path.join(home, '.config/zce-test/unit/test')
  t.is(util.getDataPath('unit', 'test'), expected3)
})

test('common:util:getTempPath', t => {
  const expected1 = path.join(tmp, 'zce-test')
  t.is(util.getTempPath(), expected1)

  const expected2 = path.join(tmp, 'zce-test/test')
  t.is(util.getTempPath('test'), expected2)

  const expected3 = path.join(tmp, 'zce-test/unit/test')
  t.is(util.getTempPath('unit', 'test'), expected3)
})

test('common:util:md5', t => {
  t.is(util.md5('zce'), 'f1963aa09931b5dade50485239cc40bc')
})

test('common:util:execute', async t => {
  t.is(await util.execute('echo zce-cli'), 'zce-cli')
  t.is(await util.execute('zce-faker notfound'), undefined)
})

test('common:util:checkUpdate', async t => {
  const stop = mockStdio.stdout()
  pkg.version = '0.0.0'
  const need1 = await util.checkUpdate()
  t.true(need1)
  pkg.version = '100.0.0'
  const need2 = await util.checkUpdate()
  t.false(need2)
  stop()
})
