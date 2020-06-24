// import { tmpdir } from 'os'
import { basename, join } from 'path'
import * as file from './file'

test('unit:core:helpers:file', async () => {
  expect(file.rimraf).toBeTruthy()
  expect(file.mkdirp).toBeTruthy()
  expect(file.tildify).toBeTruthy()
  expect(file.untildify).toBeTruthy()
  // console.log(file)
  // console.log(file.untildify('~/deve'))
  expect(file.stat).toBeTruthy()
  expect(file.readdir).toBeTruthy()
  expect(file.exists).toBeTruthy()
  expect(file.isEmpty).toBeTruthy()
  expect(file.isFile).toBeTruthy()
  expect(file.isDirectory).toBeTruthy()
})

test('unit:core:helpers:file:stat', async () => {
  const stat = await file.stat(__filename)
  expect(stat.size).toBeGreaterThan(100)
})

test('unit:core:helpers:file:readdir', async () => {
  const files = await file.readdir(__dirname)
  expect(files).toContain(basename(__filename))
})

test('unit:core:helpers:file:exists', async () => {
  const exists1 = await file.exists(__dirname)
  expect(exists1).toBe(true)
  const exists2 = await file.exists(__filename)
  expect(exists2).toBe(true)
  const exists3 = await file.exists(join(__dirname, 'fake-dir'))
  expect(exists3).toBe(false)
})

test('unit:core:helpers:file:isEmpty', async () => {
  const empty = await file.isEmpty(__dirname)
  expect(empty).toBe(false)
})

test('unit:core:helpers:file:isFile', async () => {
  const result1 = await file.isFile(__filename)
  expect(result1).toBe(true)
  const result2 = await file.isFile(__dirname)
  expect(result2).toBe(false)
})

test('unit:core:helpers:file:isDirectory', async () => {
  const result1 = await file.isDirectory(__filename)
  expect(result1).toBe(false)
  const result2 = await file.isDirectory(__dirname)
  expect(result2).toBe(true)
})
