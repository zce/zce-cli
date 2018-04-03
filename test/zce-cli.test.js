import test from 'ava'
import zceCli from '..'

test('<test-title>', t => {
  const err = t.throws(() => zceCli(100), TypeError)
  t.is(err.message, 'Expected a string, got number')

  t.is(zceCli('w'), 'w@zce.me')
  t.is(zceCli('w', { host: 'wedn.net' }), 'w@wedn.net')
})
