import os from 'os'
import fs from 'fs'
import path from 'path'
import * as http from './http'

const registry = 'https://registry.npm.taobao.org'

test('unit:core:helpers:http', async () => {
  expect(typeof http.request).toBe('function')
  expect(typeof http.download).toBe('function')
})

test('unit:core:helpers:http:request', async () => {
  const response = await http.request<Record<string, unknown>>(registry)
  expect(response.statusCode).toBe(200)
  expect(response.body).toBeTruthy()
  expect(response.body.db_name).toBe('registry')
})

test('unit:core:helpers:http:request:error', async () => {
  // const promise = http.request(`${registry}/faaaaaaaaaker`)
  // await expect(promise).rejects.toThrow('Response code 404 (Not Found)')
  try {
    await http.request(`${registry}/faaaaaaaaaker-${Date.now()}`)
  } catch (e) {
    expect(e.message).toBe('Response code 404 (Not Found)')
  }
})

test('unit:core:helpers:http:download', async () => {
  const temp = path.join(os.tmpdir(), 'zce-cli-test')
  await fs.promises.rmdir(temp, { recursive: true })
  const filename = await http.download(`${registry}/zce-cli/download/zce-cli-0.0.0.tgz`)
  expect(filename).toContain(temp)
  await fs.promises.rmdir(temp, { recursive: true })
})
