/**
 * common:http
 */

const test = require('ava')
const { http } = require('../../../lib/common')

/**
 * test dependencies
 */
const os = require('os')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const rc = require('rc')
const util = require('../../../lib/common/util')

const readdir = promisify(fs.readdir)
const { registry } = rc('npm', { registry: 'https://registry.npmjs.org/' })

test.before(async t => {
  t.context.tmpdir = path.join(os.tmpdir(), 'zce-test/http')
  await util.mkdirp(t.context.tmpdir)
})

// cleanup
test.after(async t => {
  await util.rimraf(t.context.tmpdir)
})

test('common:http:request', async t => {
  const res = await http.request(registry)
  t.truthy(res.body)
  t.is(res.body.db_name, 'registry')
})

test('common:http:request_error', async t => {
  const err = await t.throws(http.request(`${registry}faaaaaaaaaaaaaaaker`))
  t.is(err.statusCode, 404)
})

test('common:http:download', async t => {
  const dest = path.join(t.context.tmpdir, 'download')
  await http.download(`${registry}zce-cli/-/zce-cli-0.1.0-alpha.1.tgz`, dest)
  const files = await readdir(dest)
  t.truthy(files.length)
})

test('common:http:download_with_extract', async t => {
  const dest = path.join(t.context.tmpdir, 'download_with_extract')
  await http.download(`${registry}zce-cli/-/zce-cli-0.1.0-alpha.1.tgz`, dest, { extract: true, strip: 1, mode: 666 })
  const files = await readdir(dest)
  t.truthy(files.length)
})
