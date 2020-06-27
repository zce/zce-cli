import * as parser from './parser'
const pkg = require('../../package.json')

test('unit:core:parser:parse', async () => {
  const ctx = await parser.parse(['foo', '--bar'])
  expect(ctx.bin).toBe(Object.keys(pkg.bin)[0])
  expect(ctx.primary).toBe('foo')
  expect(ctx.secondary).toBe(undefined)
  expect(ctx.thirdly).toBe(undefined)
  expect(ctx.fourthly).toBe(undefined)
  expect(ctx.extras).toEqual([])
  expect(ctx.inputs).toEqual(['foo'])
  expect(ctx.options.bar).toBe(undefined) // not allowed
  expect(ctx.pkg.name).toBe(pkg.name)
})

test('unit:core:parser:parse:pkg-bin', async () => {
  pkg.name = 'foo'
  pkg.bin = './bin/foo.js'
  const ctx = await parser.parse(['foo', '--bar'])
  expect(ctx.bin).toBe('foo')
})

test('unit:core:parser:parse:with-options', async () => {
  const ctx = await parser.parse(['--foo', '-b', '--hi', 'zce'], {
    foo: {
      alias: 'f'
    },
    bar: {
      alias: ['b', 'z']
    },
    baz: {
      type: 'string',
      default: 'def'
    },
    hi: 'string'
  })
  expect(ctx.options.foo).toBe(true)
  expect(ctx.options.bar).toBe(true)
  expect(ctx.options.baz).toBe('def')
  expect(ctx.options.hi).toBe('zce')
})
