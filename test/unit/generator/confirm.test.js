const test = require('ava')

const confirm = require('../../../lib/generator/confirm')

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const mkdirp = promisify(require('mkdirp'))
const rimraf = promisify(require('rimraf'))

const mockPrompt = require('../../tool/mock-prompt')

test.before(async t => {
  const tempDir = path.join(__dirname, '../../temp/confirm')
  await mkdirp(tempDir)
  t.context.tempDir = tempDir
})

test.after(async t => {
  await rimraf(t.context.tempDir)
})

// test('generator:confirm:default', async t => {
//   process.chdir(t.context.tempDir)
//   const dest = await confirm('project1')
//   t.is(dest, path.join(t.context.tempDir, 'project1'))
// })

// test('generator:confirm:current_dir', async t => {
//   const dir = path.join(t.context.tempDir, 'project2')
//   await mkdirp(dir)
//   process.chdir(dir)
//   mockPrompt({ sure: true })
//   t.is(await confirm(), dir)
//   mockPrompt({ sure: true })
//   t.is(await confirm('.'), dir)
// })

test('generator:confirm:current_dir_not_empty', async t => {
  const dir = path.join(t.context.tempDir, 'project2')
  await mkdirp(path.join(dir, 'foo'))
  process.chdir(t.context.tempDir)
  mockPrompt({ sure: true, choose: 'overwrite' }, false)
  t.is(await confirm('project2'), dir)
})

// test('generator:confirm:current_dir', async t => {
//   const dir = path.join(tempDir, 'project1')
//   await mkdirp(dir)

//   process.chdir(dir)

//   mockPrompt({ sure: true }, false)

//   const dest = await confirm('.')
//   t.is(dest, path.resolve())
// })

// // test('generator:confirm:exists_dir', async t => {
// //   const dest = await confirm('demo')
// //   t.is(dest, path.resolve('demo'))
// // })

// test('generator:confirm:not_exists_dir', async t => {
//   const dest = await confirm(path.join(__dirname, '../../temp/generator-demo'))
//   t.is(dest, path.join(__dirname, '../../temp/generator-demo'))
// })

// // test('generator:confirm:force', t => {
// //   const dest = await confirm('demo', true)
// // })

// test('generator:confirm:cancel1', async t => {
//   mockPrompt({ sure: false })
//   await t.throws(confirm(), 'You have to cancel the init task.')
// })

// test('generator:confirm:cancel2', async t => {
//   mockPrompt({ sure: true, choose: 'cancel' })
//   await t.throws(confirm(), 'You have to cancel the init task.')
// })
