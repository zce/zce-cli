/**
 * generator:resolve
 */

const test = require('ava')
const resolve = require('../../../lib/generator/resolve')

/**
 * test dependencies
 */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const util = require('../../../lib/common/util')
const mockStdio = require('../../tool/mock-stdio')

const readdir = promisify(fs.readdir)

test.before(t => {
  // turn off stdout
  t.context.stop = mockStdio.stdout()
})

test.after(t => {
  // turn on stdout
  t.context.stop()
})

test('generator:resolve:isLocalPath', t => {
  t.true(resolve.isLocalPath('./foo'))
  t.true(resolve.isLocalPath('/foo'))
  t.true(resolve.isLocalPath('c:/foo'))
  t.true(resolve.isLocalPath('c:\\foo'))
  t.false(resolve.isLocalPath('foo'))
  t.false(resolve.isLocalPath('foo/bar'))
})

test('generator:resolve:getTemplateUrl', t => {
  t.is(resolve.getTemplateUrl('foo'), 'https://github.com/zce-templates/foo/archive/master.zip')
  t.is(resolve.getTemplateUrl('foo/bar'), 'https://github.com/foo/bar/archive/master.zip')
  t.is(resolve.getTemplateUrl('foo/bar#demo'), 'https://github.com/foo/bar/archive/demo.zip')
  t.is(resolve.getTemplateUrl('https://coding.net/u/zce/p/demo/git/archive/master.zip'), 'https://coding.net/u/zce/p/demo/git/archive/master.zip')
})

test('generator:resolve:local', async t => {
  const src = await resolve(__dirname)
  t.is(src, path.join(__dirname))
})

test('generator:resolve:short_name', async t => {
  const src = await resolve('zce-mock/unit-test')
  const files = await readdir(src)
  t.is(files.length, 3)
})

test.serial('generator:resolve:offline_fail', async t => {
  // clean cache
  await util.rimraf(util.getDataPath('generator/cache/*'))
  const src = await resolve('zce-mock/unit-test', true)
  const files = await readdir(src)
  t.is(files.length, 3)
})

test.serial('generator:resolve:offline_success', async t => {
  const src = await resolve('zce-mock/unit-test', true)
  const files = await readdir(src)
  t.is(files.length, 3)
})

test.serial('generator:resolve:download_error', async t => {
  await t.throwsAsync(resolve('zce-mock/fake-tmpl-repo'), { message: /Failed to fetch template/ })
})
