const test = require('ava')

const { version } = require('../../../lib/common')

test('common:version#checkNodeVersion', t => {
  t.true(version.checkNodeVersion())
})

test('common:version#checkPackageVersion', async t => {
  await version.checkPackageVersion()
  t.pass()
})
