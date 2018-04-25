/**
 * generator:complete
 */
const test = require('ava')
const complete = require('../../../lib/generator/complete')

/**
 * test dependencies
 */
const chalk = require('chalk')
const mockStdio = require('../../tool/mock-stdio')
const util = require('../../../lib/common/util')

test('generator:complete:message', t => {
  const stop = mockStdio.stdout()
  complete('Good luck~')
  t.is(stop(), '\nGood luck~\n\n')
})

test('generator:complete:template_message', t => {
  const stop = mockStdio.stdout()
  const context = { src: '/path/to/src', dest: '/path/to/dest' }
  /* eslint-disable no-template-curly-in-string */
  complete('${ src } -> ${ dest }', context)
  t.is(stop(), `\n${context.src} -> ${context.dest}\n\n`)
})

test('generator:complete:callback', t => {
  const stop = mockStdio.stdout()
  const context = { dest: '/path/to/dest' }
  complete(context => { console.log(context.dest) }, context)
  t.is(stop(), `\n${context.dest}\n\n`)
})

test('generator:complete:default', t => {
  const stop = mockStdio.stdout()
  const context = { dest: '/path/to/dest', answers: { name: 'test-proj' } }
  complete(undefined, context)
  t.is(stop(), `\n🎉  "${context.answers.name}" generated into ${chalk.yellow(util.tildify(context.dest))}\n\n`)
})
