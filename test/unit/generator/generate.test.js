/**
 * generator:generate
 */

const test = require('ava')
const generate = require('../../../lib/generator/generate')

/**
 * test dependencies
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { promisify } = require('util')
const util = require('../../../lib/common/util')
const mockStdio = require('../../tool/mock-stdio')

const readFile = promisify(fs.readFile)
const templatesDir = path.join(__dirname, '../../mock/templates')

test.before(async t => {
  // turn off stdout
  t.context.stop = mockStdio.stdout()

  t.context.tmpdir = path.join(os.tmpdir(), 'zce-test/generate')
  await util.mkdirp(t.context.tmpdir)
})

// cleanup
test.after(async t => {
  await util.rimraf(t.context.tmpdir)

  // turn on stdout
  t.context.stop()
})

test('generator:generate:minima', async t => {
  const src = path.join(templatesDir, 'minima')
  const dest = path.join(t.context.tmpdir, 'minima')
  const answers = { name: 'minima' }

  const files = await generate(src, dest, answers)

  t.truthy(files['zce.txt'])

  const content = await readFile(path.join(dest, 'zce.txt'), 'utf8')
  t.is(content.trim(), 'hey minima')
})

test('generator:generate:rename', async t => {
  const src = path.join(templatesDir, 'rename')
  const dest = path.join(t.context.tmpdir, 'rename')
  const answers = { name: 'rename' }

  const files = await generate(src, dest, answers)

  t.truthy(files['rename.txt'])
  t.truthy(files[path.normalize('sub/rename.txt')])

  const content1 = await readFile(path.join(dest, 'rename.txt'), 'utf8')
  t.is(content1.trim(), 'hey rename')

  const content2 = await readFile(path.join(dest, 'sub/rename.txt'), 'utf8')
  t.is(content2.trim(), 'hey rename')
})

test('generator:generate:source', async t => {
  const src = path.join(templatesDir, 'source')
  const dest = path.join(t.context.tmpdir, 'source')
  const answers = { name: 'source' }
  const options = require(src)

  const files = await generate(src, dest, answers, options)

  t.truthy(files['zce.txt'])

  const content = await readFile(path.join(dest, 'zce.txt'), 'utf8')
  t.is(content.trim(), 'hey source')
})

test('generator:generate:filters', async t => {
  const src = path.join(templatesDir, 'filters')
  const dest = path.join(t.context.tmpdir, 'filters')
  const answers = { sass: false }
  const options = require(src)

  const files = await generate(src, dest, answers, options)

  t.is(Object.keys(files).length, 2)
  t.true(await util.exists(path.join(dest, 'assets/style.css')))
  t.false(await util.exists(path.join(dest, 'assets/style.scss')))

  const content = await readFile(path.join(dest, 'index.html'), 'utf8')
  t.is(content.trim(), '<h1>use css</h1>')
})

test('generator:generate:helpers', async t => {
  const src = path.join(templatesDir, 'helpers')
  const dest = path.join(t.context.tmpdir, 'helpers')
  const answers = { name: 'helpers' }
  const options = require(src)

  const files = await generate(src, dest, answers, options)

  t.is(Object.keys(files).length, 2)

  const content1 = await readFile(path.join(dest, 'built-in.txt'), 'utf8')
  t.is(content1.trim(), 'fooBar')

  const content2 = await readFile(path.join(dest, 'custom.txt'), 'utf8')
  t.is(content2.trim(), 'HELPERS')
})

test('generator:generate:plugin', async t => {
  const src = path.join(templatesDir, 'plugin')
  const dest = path.join(t.context.tmpdir, 'plugin')
  const answers = { name: 'plugin' }
  const options = require(src)

  const files = await generate(src, dest, answers, options)

  t.truthy(files['zce.txt'])

  const content = await readFile(path.join(dest, 'zce.txt'), 'utf8')
  t.is(content.trim(), 'zce plugin hey plugin intercept')
})

test('generator:generate:error', async t => {
  const src = path.join(templatesDir, 'error')
  const dest = path.join(t.context.tmpdir, 'error')
  const answers = { name: 'error' }

  await t.throwsAsync(generate(src, dest, answers), { message: 'fake is not defined' })
})
