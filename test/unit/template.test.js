const assert = require('assert')
const template = require('../../lib/template')

describe('lib/template', () => {
  describe('#normal', () => {
    const actual = 'hello world'
    const input = 'hello {{foo}}'
    it(`Should return '${actual}' when input '${input}'`, () => {
      assert.equal(
        actual,
        template.render(input, { foo: 'world' })
      )
    })
  })

  describe('#not-have-mustaches', () => {
    const actual = 'hello world'
    const input = 'hello world'
    it(`Should return '${actual}' when input '${input}'`, () => {
      assert.equal(
        actual,
        template.render(input, { foo: 'world' })
      )
    })
  })

  describe('#options', () => {
    const actual = 'hello world zce-cli'
    const input = 'hello {{foo}} {{@bar}}'
    it(`Should return '${actual}' when input '${input}'`, () => {
      assert.equal(
        actual,
        template.render(input, { foo: 'world' }, { data: { bar: 'zce-cli' } })
      )
    })
  })

  describe('#built-in-helpers', () => {
    const actual = 'hello world zce-cli'
    const input = 'hello {{#eq foo "world"}}{{foo}}{{/eq}} {{^eq bar "world"}}{{bar}}{{/eq}}'
    it(`Should return '${actual}' when input '${input}'`, () => {
      assert.equal(
        actual,
        template.render(input, { foo: 'world', bar: 'zce-cli' })
      )
    })
  })

  describe('#error', () => {
    it('Should throw error when debug mode and context undefined', () => {
      const env = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      assert.throws(() => template.render('hello {{foo}}'), /undefined/)
      process.env.NODE_ENV = env
    })

    it('Should throw error when debug mode and template parse error', () => {
      const env = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      assert.throws(() => template.render('{{error,foo}}'), /Parse error/)
      process.env.NODE_ENV = env
    })
  })

  describe('#register-helper', () => {
    const actual = 'hello world'
    const input = 'hello {{lowercase foo}}'
    it(`Should return '${actual}' when input '${input}'`, () => {
      template.registerHelper('lowercase', str => str.toLowerCase())
      assert.equal(
        actual,
        template.render(input, { foo: 'WORLD' })
      )
    })
  })
})
