/* eslint-disable no-template-curly-in-string */

import * as strings from './strings'

test('unit:core:helpers:strings:render', async () => {
  const result1 = strings.render('foo <%= bar %>', { bar: 'baz' })
  expect(result1).toBe('foo baz')

  const result2 = strings.render('foo ${bar}', { bar: 'baz' })
  expect(result2).toBe('foo baz')
})

test('unit:core:helpers:strings:render:options', async () => {
  const result = strings.render('<%= foo %> <%= bar() %>', {}, {
    imports: {
      foo: 'bar',
      bar: () => 'baz'
    }
  })
  expect(result).toBe('bar baz')
})

test('unit:core:helpers:strings:md5', async () => {
  const result = strings.md5('zce')
  expect(result).toBe('f1963aa09931b5dade50485239cc40bc')
})
