const test = require('ava')

const { http } = require('../../../lib/common')

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const rimraf = require('rimraf')

const readdir = promisify(fs.readdir)
const rimrafp = promisify(rimraf)

test('common:http:request', async t => {
  const res = await http.request('https://registry.npmjs.org')
  t.truthy(res.body)
  t.is(res.body.db_name, 'registry')

  try {
    await http.request('https://registry.npmjs.org/faaaaaaake')
  } catch (e) {
    t.is(e.statusCode, 404)
    t.is(e.statusMessage, 'Not Found')
  }
})

test('common:http:download', async t => {
  const dest1 = path.join(__dirname, '../../temp/http-download', 'test1')
  await http.download('https://raw.githubusercontent.com/zce/zce-cli/master/README.md', dest1)
  const files1 = await readdir(dest1)
  t.truthy(files1.length)

  const dest2 = path.join(__dirname, '../../temp/http-download', 'test2')
  await http.download('https://github.com/zce/zce-cli/archive/master.zip', dest2, { extract: true, strip: 1, mode: 666 })
  const files2 = await readdir(dest2)
  t.truthy(files2.length)

  // clear
  await rimrafp(path.join(__dirname, '../../temp/http-download'))
})
