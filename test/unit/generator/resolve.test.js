const test = require('ava')

const resolve = require('../../../lib/generator/resolve')

test('generator:resolve#isLocalPath', t => {
  t.true(resolve.isLocalPath('./foo'))
  t.true(resolve.isLocalPath('/foo'))
  t.true(resolve.isLocalPath('c:/foo'))
  t.true(resolve.isLocalPath('c:\\foo'))
  t.false(resolve.isLocalPath('foo'))
  t.false(resolve.isLocalPath('foo/bar'))
})

test('generator:resolve#getTemplateUrl', t => {
  t.is(resolve.getTemplateUrl('foo'), 'https://github.com/zce-templates/foo/archive/master.zip')
  t.is(resolve.getTemplateUrl('foo/bar'), 'https://github.com/foo/bar/archive/master.zip')
  t.is(resolve.getTemplateUrl('foo/bar#demo'), 'https://github.com/foo/bar/archive/demo.zip')
  t.is(resolve.getTemplateUrl('https://coding.net/u/zce/p/demo/git/archive/master.zip'), 'https://coding.net/u/zce/p/demo/git/archive/master.zip')
})

test('generator:resolve#default', async t => {
  t.pass()
})
