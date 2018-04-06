import test from 'ava'
import { util } from '..'

test('util', async t => {
  const res = util.got('https://registry.npmjs.org/zce-cli/latest')
  console.log(res.statusCode)
})
