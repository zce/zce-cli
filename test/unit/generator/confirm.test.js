const test = require('ava')

const confirm = require('../../../lib/generator/confirm')

const path = require('path')
const { promisify } = require('util')

const mkdirp = promisify(require('mkdirp'))
const rimraf = promisify(require('rimraf'))

const mockPrompt = require('../../tool/mock-prompt')

// prepare cwd
test.before(async t => {
  const tempDir = path.join(__dirname, '../../temp/confirm')
  await mkdirp(tempDir)
  t.context.tempDir = tempDir
  t.context.realCwd = process.cwd()
  process.chdir(tempDir)
})

// cleanup
test.after(async t => {
  process.chdir(t.context.realCwd)
  await rimraf(t.context.tempDir)
})

/**
 * Test case 0
 * mockPrompt should run in serial test!!!
 */
test.serial('generator:confirm:default_parameters', async t => {
  mockPrompt({ sure: false })
  await t.throws(confirm(), 'You have to cancel the init task.')
})

/**
 * Test case 1
 */
test('generator:confirm:not_exists_dir', async t => {
  const dest = await confirm('project1')
  t.is(dest, path.join(t.context.tempDir, 'project1'))
})

/**
 * Test case 2
 */
test.serial('generator:confirm:exists_dir_empty1', async t => {
  const dir = path.join(t.context.tempDir, 'project2')
  await mkdirp(dir)
  mockPrompt({ sure: true })
  t.is(await confirm('project2'), dir)
})

/**
 * Test case 3
 */
test.serial('generator:confirm:exists_dir_empty2', async t => {
  const dir = path.join(t.context.tempDir, 'project3')
  await mkdirp(dir)
  mockPrompt({ sure: true })
  t.is(await confirm('project3'), dir)
})

/**
 * Test case 4
 */
test('generator:confirm:exists_dir_not_empty_force', async t => {
  const dir = path.join(t.context.tempDir, 'project4')
  await mkdirp(dir)
  t.is(await confirm('project4', true), dir)
})

/**
 * Test case 5
 */
test.serial('generator:confirm:exists_dir_not_empty_overwrite', async t => {
  const dir = path.join(t.context.tempDir, 'project5')
  await mkdirp(path.join(dir, 'foo'))
  mockPrompt({ sure: true, choose: 'overwrite' }, 2)
  t.is(await confirm('project5'), dir)
})

/**
 * Test case 6
 */
test.serial('generator:confirm:exists_dir_not_empty_merge', async t => {
  const dir = path.join(t.context.tempDir, 'project6')
  await mkdirp(path.join(dir, 'foo'))
  mockPrompt({ sure: true, choose: 'merge' }, 2)
  t.is(await confirm('project6'), dir)
})

/**
 * Test case 7
 */
test.serial('generator:confirm:exists_dir_not_empty_cancel1', async t => {
  const dir = path.join(t.context.tempDir, 'project7')
  await mkdirp(path.join(dir, 'foo'))
  mockPrompt({ sure: false })
  await t.throws(confirm('project7'), 'You have to cancel the init task.')
})

/**
 * Test case 8
 */
test.serial('generator:confirm:exists_dir_not_empty_cancel2', async t => {
  const dir = path.join(t.context.tempDir, 'project8')
  await mkdirp(path.join(dir, 'foo'))
  mockPrompt({ sure: true, choose: 'cancel' }, 2)
  await t.throws(confirm('project8'), 'You have to cancel the init task.')
})
