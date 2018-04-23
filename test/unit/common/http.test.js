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
const url = require('url')
const path = require('path')
const { promisify } = require('util')
const rc = require('rc')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')

const readdir = promisify(fs.readdir)
const mkdir = promisify(mkdirp)
const rm = promisify(rimraf)
const { registry } = rc('npm', { registry: 'https://registry.npmjs.org/' })

test.before(async t => {
  t.context.tmpdir = path.join(os.tmpdir(), 'zce-test/http')
  await mkdir(t.context.tmpdir)
})

test.after(async t => {
  // clear
  await rm(t.context.tmpdir)
})

test('common:http:request', async t => {
  const res = await http.request(registry)
  t.truthy(res.body)
  t.is(res.body.db_name, 'registry')

  const err = await t.throws(http.request(url.resolve(registry, 'faaaaaaake')))
  t.is(err.statusCode, 404)
})

test('common:http:download', async t => {
  const dest1 = path.join(__dirname, '../../temp/http-download', 'test1')
  await http.download('https://registry.npmjs.org/zce-cli/-/zce-cli-0.1.0-alpha.1.tgz', dest1)
  const files1 = await readdir(dest1)
  t.truthy(files1.length)

  const dest2 = path.join(__dirname, '../../temp/http-download', 'test2')
  await http.download('https://registry.npmjs.org/zce-cli/-/zce-cli-0.1.0-alpha.1.tgz', dest2, { extract: true, strip: 1, mode: 666 })
  const files2 = await readdir(dest2)
  t.truthy(files2.length)
})
