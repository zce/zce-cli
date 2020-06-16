/**
 * generator:confirm
 */

const test = require('ava')
const confirm = require('../../../lib/generator/confirm')

/**
 * test dependencies
 */
const os = require('os')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const mockPrompt = require('mock-prompt')
const mockStdio = require('../../tool/mock-stdio')
const util = require('../../../lib/common/util')

const writeFile = promisify(fs.writeFile)

// prepare cwd
test.before(async t => {
  // turn off stdout
  t.context.stop = mockStdio.stdout()

  const tmpdir = path.join(os.tmpdir(), 'zce-test/confirm')
  await util.mkdirp(tmpdir)

  // realpathSync https://github.com/nodejs/node/issues/7545
  t.context.tmpdir = fs.realpathSync(tmpdir)

  t.context.originalCwd = process.cwd()
  process.chdir(t.context.tmpdir)
})

// cleanup
test.after(async t => {
  process.chdir(t.context.originalCwd)
  await util.rimraf(t.context.tmpdir)

  // turn on stdout
  t.context.stop()
})

/**
 * Test case 0
 * mockPrompt should run in serial test!!!
 */
test.serial('generator:confirm:default_parameters', async t => {
  mockPrompt({ sure: false })
  await t.throwsAsync(confirm(), { message: 'You have to cancel the init task.' })
})

/**
 * Test case 1
 */
test('generator:confirm:not_exists_dir', async t => {
  const dest = await confirm('project1')
  t.is(dest, path.join(t.context.tmpdir, 'project1'))
})

/**
 * Test case 2
 */
test.serial('generator:confirm:exists_dir_empty', async t => {
  const dir = path.join(t.context.tmpdir, 'project2')
  await util.mkdirp(dir)
  mockPrompt({ sure: true })
  t.is(await confirm('project2'), dir)
})

/**
 * Test case 3
 */
test('generator:confirm:exists_dir_force', async t => {
  const dir = path.join(t.context.tmpdir, 'project3')
  await util.mkdirp(dir)
  t.is(await confirm('project3', true), dir)
})

/**
 * Test case 4
 */
test('generator:confirm:exists_file', async t => {
  const filename = path.join(t.context.tmpdir, 'project4')
  await writeFile(filename, '')
  await t.throwsAsync(confirm('project4'), 'Cannot init project4: File exists.')
})

/**
 * Test case 5
 */
test('generator:confirm:exists_file_force', async t => {
  const filename = path.join(t.context.tmpdir, 'project5')
  await writeFile(filename, '')
  t.is(await confirm('project5', true), filename)
})

/**
 * Test case 6
 */
test.serial('generator:confirm:exists_dir_not_empty_overwrite', async t => {
  const dir = path.join(t.context.tmpdir, 'project6')

  // create exist file
  await util.mkdirp(path.join(dir, 'foo'))

  mockPrompt({ sure: true, choose: 'overwrite' })

  t.is(await confirm('project6'), dir)
  // foo has being removed
  t.false(await util.exists(path.join(dir, 'foo')))
})

/**
 * Test case 7
 */
test.serial('generator:confirm:exists_dir_not_empty_merge', async t => {
  const dir = path.join(t.context.tmpdir, 'project7')

  // create exist file
  await util.mkdirp(path.join(dir, 'foo'))

  mockPrompt({ sure: true, choose: 'merge' })

  t.is(await confirm('project7'), dir)
  // foo has not removed
  t.true(await util.exists(path.join(dir, 'foo')))
})

/**
 * Test case 8
 */
test.serial('generator:confirm:exists_dir_not_empty_cancel1', async t => {
  const dir = path.join(t.context.tmpdir, 'project8')
  await util.mkdirp(path.join(dir, 'foo'))
  mockPrompt({ sure: false })
  await t.throwsAsync(confirm('project8'), 'You have to cancel the init task.')
})

/**
 * Test case 9
 */
test.serial('generator:confirm:exists_dir_not_empty_cancel2', async t => {
  const dir = path.join(t.context.tmpdir, 'project9')
  await util.mkdirp(path.join(dir, 'foo'))
  mockPrompt({ sure: true, choose: 'cancel' })
  await t.throwsAsync(confirm('project9'), 'You have to cancel the init task.')
})
