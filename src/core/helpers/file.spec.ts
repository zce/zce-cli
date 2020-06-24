import os from 'os'
import path from 'path'
import * as file from './file'

test('unit:core:helpers:file', async () => {
  expect(file.tildify).toBeTruthy()
  expect(file.untildify).toBeTruthy()
  expect(file.remove).toBeTruthy()
  expect(file.stat).toBeTruthy()
  expect(file.mkdir).toBeTruthy()
  expect(file.readdir).toBeTruthy()
  expect(file.exists).toBeTruthy()
  expect(file.isEmpty).toBeTruthy()
  expect(file.isFile).toBeTruthy()
  expect(file.isDirectory).toBeTruthy()
})

test('unit:core:helpers:file:remove', async () => {
  const temp = await file.mkdir('test-file-remove')
  await file.remove(temp)
  const exists = await file.exists(temp)
  expect(exists).toBe(false)
})

test('unit:core:helpers:file:stat', async () => {
  const stat = await file.stat(__filename)
  expect(stat.size).toBeGreaterThan(100)
})

test('unit:core:helpers:file:readdir', async () => {
  const files = await file.readdir(__dirname)
  expect(files).toContain(path.basename(__filename))
})

test('unit:core:helpers:file:mkdir', async () => {
  const dir = await file.mkdir('test/.temp')
  expect(dir).toContain(path.join(process.cwd(), 'test/.temp'))
  const exists = await file.exists(dir)
  expect(exists).toBe(true)
  await file.remove(dir)
  const target2 = path.join(os.tmpdir(), 'zce-cli-test-file-mkdir')
  const dir2 = await file.mkdir(target2)
  expect(dir2).toContain(target2)
  const exists2 = await file.exists(dir2)
  expect(exists2).toBe(true)
  await file.remove(dir2)
})

test('unit:core:helpers:file:exists', async () => {
  const exists1 = await file.exists(__dirname)
  expect(exists1).toBe(true)
  const exists2 = await file.exists(__filename)
  expect(exists2).toBe(true)
  const exists3 = await file.exists(path.join(__dirname, 'fake-dir'))
  expect(exists3).toBe(false)
})

test('unit:core:helpers:file:isEmpty', async () => {
  const empty1 = await file.isEmpty(__dirname)
  expect(empty1).toBe(false)
  const temp = path.join(os.tmpdir(), 'zce-cli-test-file-isempty')
  await file.mkdir(temp)
  const empty2 = await file.isEmpty(temp)
  expect(empty2).toBe(true)
  await file.remove(temp)
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
