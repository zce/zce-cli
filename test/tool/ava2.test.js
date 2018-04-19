const test = require('ava')

test('ava:demo3', async t => {
  process.chdir('/Users/zce/Local/Coding/zce-cli')
  console.log(process.cwd())
  t.pass()
})

