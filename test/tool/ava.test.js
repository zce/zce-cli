const test = require('ava')

const sleep = timeout => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(Date.now())
  }, timeout)
})

let counter = 0

test.before(t => {
  console.log('before')
})

test.after(t => {
  console.log('after')
})

test.beforeEach(t => {
  console.log('beforeEach')
})

test.afterEach(t => {
  console.log('afterEach')
})

test('ava:demo1', async t => {
  await sleep(1000)
  console.log(counter++)
  t.pass()
})

test('ava:demo2', async t => {
  await sleep(1000)
  console.log(counter++)
  t.pass()
})

test('ava:demo3', async t => {
  await sleep(1000)
  console.log(counter++)
  t.pass()
})
