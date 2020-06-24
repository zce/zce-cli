import { tmpdir } from 'os'
import { join } from 'path'
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

// test('unit:core:helpers:file:stat:error', async () => {
//   const promise = file.request(`${registry}/faaaaaaaaaker`)

//   expect(promise).rejects.toThrow('Response code 404 (Not Found)')
// })

// test('unit:core:helpers:file:download', async () => {
//   const filename = await file.download(`${registry}/zce-cli/download/zce-cli-0.0.0.tgz`)

//   expect(filename).toBe(join(tmpdir(), 'zce-cli/zce-cli-0.0.0.tgz'))
// })
