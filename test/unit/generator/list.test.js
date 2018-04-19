const test = require('ava')

const { generator } = require('../../..')

test('generator#list', async t => {
  await Promise.all([
    generator.list(),
    generator.list('zce-templates'),
    generator.list('zce-templates', { short: true }),
    generator.list('fake-users'),
    generator.list('wedn'),
    generator.list('wedn', { short: true }),
    generator.list('fake-users-12580')
  ])
  t.pass()
})
