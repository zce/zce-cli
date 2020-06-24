import * as template from './template'

test('unit:core:helpers:template', async () => {
  expect(template.render).toBeTruthy()
  expect(template.registerHelpers).toBeTruthy()
})

test('unit:core:helpers:template:render', async () => {
  const result1 = template.render('foo <%= bar %>', { bar: 'baz' })
  // eslint-disable-next-line no-template-curly-in-string
  const result2 = template.render('foo ${bar}', { bar: 'baz' })

  expect(result1).toBe('foo baz')
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
