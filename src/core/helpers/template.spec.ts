/* eslint-disable no-template-curly-in-string */

import * as template from './template'

test('unit:core:helpers:template', async () => {
  expect(typeof template.render).toBe('function')
  expect(typeof template.registerHelpers).toBe('function')
})

test('unit:core:helpers:template:render', async () => {
  const result1 = template.render('foo <%= bar %>', { bar: 'baz' })
  expect(result1).toBe('foo baz')

  const result2 = template.render('foo ${bar}', { bar: 'baz' })
  expect(result2).toBe('foo baz')
})

test('unit:core:helpers:template:registerHelpers', async () => {
  template.registerHelpers({
    foo: 'bar',
    bar: () => 'baz'
  })
  const result = template.render('<%= foo %> <%= bar() %>', {})

  expect(result).toBe('bar baz')
})
