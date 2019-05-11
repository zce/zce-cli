import * as http from './http'

const registry = 'https://registry.npm.taobao.org'

test('unit:core:helpers:http', async () => {
  expect(http.request).toBeTruthy()
  expect(http.download).toBeTruthy()
})

test('unit:core:helpers:http:request', async () => {
  const res = await http.request(registry)
  expect(res.body).toBeTruthy()
  expect(res.body.db_name).toBe('registry')
})

test('unit:core:helpers:http:request:error', async () => {
  const promise = http.request(`${registry}/faaaaaaaaaker`)
  expect(promise).rejects.toThrow('Response code 404 (Not Found)')
})

// test('unit:core:helpers:http:download', async () => {
//   const stream = await http.download(`${registry}/zce-cli/download/zce-cli-0.0.0.tgz`)
//   stream
// })
