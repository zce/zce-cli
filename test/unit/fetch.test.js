const os = require('os')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const rimraf = require('rimraf')
const fetch = require('../../lib/fetch')

describe('lib/fetch', function () {
  this.timeout(10000)
  rimraf.sync(fetch.cachePath)

  describe('#template-name', () => {
    it('Should fetch repo from `https://github.com/zce-mock/unit-test`', () => {
      return fetch('zce-mock/unit-test')
        .then(source => assert.ok(fs.existsSync(source)))
        .catch(err => assert.ok(!err))
    })

    // rimraf cache when cache exist
    it('Should fetch repo from `https://github.com/zce-mock/unit-test`', () => {
      return fetch('zce-mock/unit-test')
        .then(source => assert.ok(fs.existsSync(source)))
        .catch(err => assert.ok(!err))
    })
  })

  describe('#offline-mode', () => {
    // cache exist
    it('Should fetch repo from `https://github.com/zce-mock/unit-test`', () => {
      return fetch('zce-mock/unit-test', true)
        .then(source => assert.ok(fs.existsSync(source)))
        .catch(err => assert.ok(!err))
    })

    // cache not exist
    it('Should fetch repo from `https://github.com/zce-mock/unit-test-2`', () => {
      return fetch('zce-mock/unit-test-2', true)
        .then(source => assert.ok(fs.existsSync(source)))
        .catch(err => assert.ok(!err))
    })
  })

  describe('#full-uri', () => {
    it('Should fetch repo from `https://coding.net/u/zce/p/mock-unit/git/archive/master`', () => {
      return fetch('https://coding.net/u/zce/p/mock-unit/git/archive/master')
        .then(source => assert.ok(fs.existsSync(source)))
        .catch(err => assert.ok(!err))
    })
  })

  describe('#not-exist', () => {
    it('Should fetch repo failed: `https://github.com/zce-mock/fake-unit`', () => {
      return fetch('zce-mock/fake-unit')
        .then(source => assert.ok(false))
        .catch(err => assert.throws(() => { throw err }, /Not Found/))
    })
  })
})
