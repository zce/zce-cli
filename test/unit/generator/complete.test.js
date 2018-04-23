/**
 * generator:complete
 */
const test = require('ava')
const complete = require('../../../lib/generator/complete')

/**
 * test dependencies
 */
const mockStdio = require('../../tool/mock-stdio')

test('generator:complete:string', t => {
  const stop = mockStdio.stdout()
  complete('Good luck~')
  t.is(stop(), '\nGood luck~\n\n')
})

test('generator:complete:string_with_context', t => {
  const stop = mockStdio.stdout()
  /* eslint-disable no-template-curly-in-string */
  complete('-> ${ dest }', { dest: __dirname })
  t.is(stop(), `\n-> ${__dirname}\n\n`)
})

test('generator:complete:callback', t => {
  const stop = mockStdio.stdout()
  complete(context => { console.log(context.dest) }, { dest: __dirname })
  t.is(stop(), `${__dirname}\n`)
})

test('generator:complete:error', t => {
  t.throws(() => complete(1), TypeError)
  t.throws(() => complete(true), TypeError)
  t.throws(() => complete({}), TypeError)
  t.throws(() => complete([]), TypeError)
})
