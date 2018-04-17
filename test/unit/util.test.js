const os = require('os')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const rimraf = require('rimraf')

const test = require('ava')
const util = require('../../lib/util')

const readdir = promisify(fs.readdir)
const rimrafp = promisify(rimraf)

test('utils logger', t => {
  util.success('hello zce-cli')
  util.error('hello zce-cli')
  util.warn('hello zce-cli')
  util.info('hello zce-cli')
  util.boxen('hello zce-cli')
  util.clearConsole('zce-cli')
  t.pass()
})

test('util#existsDir', t => {
  t.true(util.existsDir(__dirname))
  t.false(util.existsDir(path.join(__dirname, 'fake-dir')))
})

test('util#tildify', t => {
  t.is(util.tildify(path.join(os.homedir(), 'foo')), '~/foo')
  t.is(util.tildify(os.homedir()), '~')
  t.is(util.tildify('/foo'), '/foo')
})

test('util#untildify', t => {
  t.is(util.untildify('~/foo'), path.join(os.homedir(), 'foo'))
  t.is(util.untildify('~'), os.homedir())
  t.is(util.untildify('/foo'), '/foo')
})

test('util#request', async t => {
  const res = await util.request('https://registry.npmjs.org')
  t.truthy(res.body)
  t.is(res.body.db_name, 'registry')

  try {
    await util.request('https://no.npmjs.org')
  } catch (e) {
    t.is(e.code, 'ENOTFOUND')
  }
})

test('util#download', async t => {
  const dest1 = path.join(__dirname, '..', 'temp/util-download', 'test1')
  await util.download('https://raw.githubusercontent.com/zce/zce-cli/master/README.md', dest1)
  const files1 = await readdir(dest1)
  t.truthy(files1.length)

  const dest2 = path.join(__dirname, '..', 'temp/util-download', 'test2')
  await util.download('https://github.com/zce/zce-cli/archive/master.zip', dest2, { extract: true, strip: 1, mode: 666 })
  const files2 = await readdir(dest2)
  t.truthy(files2.length)

  // clear
  await rimrafp(path.join(__dirname, '..', 'temp/util-download'))
})

test('util#checkNodeVersion', t => {
  t.true(util.checkNodeVersion())
})

test('util#checkPackageVersion', async t => {
  await util.checkPackageVersion()
  t.pass()
})

test('util#md5', t => {
  t.is(util.md5('zce'), 'f1963aa09931b5dade50485239cc40bc')
})

