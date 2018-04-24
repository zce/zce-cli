/**
 * common:template
 */

const test = require('ava')
const { template } = require('../../../lib/common')

test('common:template:default', t => {
  const result = template.render('hello <%= message %>', { message: 'world' })
  t.is(result, 'hello world')
})

test('common:template:delimiter', t => {
  /* eslint-disable no-template-curly-in-string */
  const result = template.render('hello ${ message }', { message: 'world' })
  t.is(result, 'hello world')
})

test('common:template:helpers', t => {
  template.registerHelpers({
    lowercase: input => input.toLowerCase()
  })
  /* eslint-disable no-template-curly-in-string */
  const result = template.render('hello ${ lowercase(message) }', { message: 'WORLD' })
  t.is(result, 'hello world')
})

test('common:template:options', t => {
  /* eslint-disable no-template-curly-in-string */
  const result = template.render('hello ${ data.message }', { message: 'world' }, { variable: 'data' })
  t.is(result, 'hello world')
})
