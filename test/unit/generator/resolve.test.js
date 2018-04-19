const test = require('ava')

const resolve = require('../../../lib/generator/resolve')

const os = require('os')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const rimraf = promisify(require('rimraf'))

const pkg = require('../../../package')

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
  const src = await resolve(path.join(__dirname, '../../mock/minima'))
  const files = fs.readdirSync(src)
  t.is(files.length, 3)
})

test('generator:resolve:default', async t => {
  const src = await resolve('zce-mock/unit-test')
  const files = fs.readdirSync(src)
  t.is(files.length, 3)
})

test.serial('generator:resolve:offline_fail', async t => {
  // clean cache
  await rimraf(path.join(os.homedir(), '.cache', pkg.name))
  const src = await resolve('zce-mock/unit-test', true)
  const files = fs.readdirSync(src)
  t.is(files.length, 3)
})

test.serial('generator:resolve:offline_success', async t => {
  const src = await resolve('zce-mock/unit-test', true)
  const files = fs.readdirSync(src)
  t.is(files.length, 3)
})

test.serial('generator:resolve:download_error', async t => {
  await t.throws(resolve('zce-mock/fake-tmpl-repo'), /Failed to fetch template/)
})
