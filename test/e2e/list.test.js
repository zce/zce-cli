const assert = require('assert')
const list = require('../../lib/cli-list')

describe('lib/cli-list', function () {
  this.timeout(10000)

  describe('#normal', () => {
    it('Short return an array when user has some repos', () => {
      return list(undefined)
        .then(repos => assert.ok(Array.isArray(repos)))
        .catch(err => assert.ok(!err))
    })
  })

  describe('#empty', () => {
    it('Short return an empty array when user has no repos', () => {
      return list('fake-users')
        .then(repos => assert.ok(Array.isArray(repos)))
        .catch(err => assert.ok(!err))
    })
  })

  describe('#short', () => {
    it('Short return an array when user has some repos', () => {
      return list(undefined, true)
        .then(repos => assert.ok(Array.isArray(repos)))
        .catch(err => assert.ok(!err))
    })
  })

  describe('#error', () => {
    it('Short log full error info and exit process', () => {
      return list('fake-users-12580')
        .then(repos => assert.ok(false))
        .catch(err => assert.throws(() => { throw err }, /Not Found/))
    })
  })
})
