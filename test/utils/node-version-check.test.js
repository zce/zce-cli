import test from 'ava'
import sinon from 'sinon'

import nodeVersionCheck from '../../lib/utils/node-version-check'

test.beforeEach(t => {
  // t.context.error = console.error
  // console.error = sinon.spy()
  t.context.exit = process.exit
  process.exit = sinon.spy()
})

test.afterEach(t => {
  // console.error = t.context.error
  process.exit = t.context.exit
})

test('utils:node-version-check', t => {
  nodeVersionCheck({ name: 'zce', engines: { node: '>1.0' } })
  t.true(process.exit.notCalled)

  nodeVersionCheck({ name: 'zce', engines: { node: '>20.0' } })
  t.is(process.exit.lastCall.args[0], 1)
})
