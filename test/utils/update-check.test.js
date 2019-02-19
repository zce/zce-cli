import test from 'ava'

import updateCheck from '../../lib/utils/update-check'

test('utils:node-version-check', t => {
  updateCheck({ name: 'zce', version: '0.1.0' })
  updateCheck({ name: 'zce', version: '0.1.0' })
  t.pass()
})
