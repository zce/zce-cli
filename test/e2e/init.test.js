const fs = require('fs')
const path = require('path')
const assert = require('assert')
const rimraf = require('rimraf')
const init = require('../../lib/cli-init')
const patchInquirer = require('../common/patch-inquirer')

process.env.NODE_ENV = 'testing'

describe('lib/init', function () {
  this.timeout(20000)
  rimraf.sync(path.join(__dirname, '../build'))

  it('Should run initial command', done => {
    // case 1: basic
    patchInquirer({ name: 'foo' })
    init('zce-mock/e2e-test', path.join(__dirname, '../build/e2e/temp'), true, true)
      .then(context => {
        assert.equal('zce-mock/e2e-test', context.template)
        assert.equal(path.join(__dirname, '../build/e2e/temp'), context.dest)
        assert.equal(false, context.exists)
        assert.equal('foo', context.answers.name)
        assert.ok(fs.existsSync(context.dest))

        // case 2: confirm dest exist
        patchInquirer({ ok: true, name: 'foo' })
        return init('zce-mock/e2e-test', path.join(__dirname, '../build/e2e/temp'), true, true)
      })
      .then(context => {
        assert.equal(true, context.exists)
        assert.ok(fs.existsSync(context.dest))

        // case 3: local template
        patchInquirer({})
        return init(path.join(__dirname, '../mock/minima'), path.join(__dirname, '../build/e2e/local'), true, true)
      })
      .then(context => {
        assert.equal(path.join(__dirname, '../mock/minima'), context.template)
        assert.ok(fs.existsSync(context.dest))

        // case 4: cancel init
        patchInquirer({ ok: false })
        return init('zce-mock/e2e-test', path.join(__dirname, '../build/e2e/local'), true, true)
      })
      .then(context => assert.ok(false))
      .catch(err => {
        assert.throws(() => { throw err }, /You have to cancel the init task./)

        // case 5: default dest
        patchInquirer({ ok: false })
        return init('zce-mock/e2e-test', undefined, true, true)
      })
      .then(context => assert.ok(false))
      .catch(err => {
        assert.throws(() => { throw err }, /You have to cancel the init task./)

        // case 6: template invalid
        patchInquirer({ ok: true })
        return init(path.join(__dirname, '../mock/invalid'), path.join(__dirname, '../build/e2e/temp'), true, true)
      })
      .then(context => assert.ok(false))
      .catch(err => {
        assert.throws(() => { throw err }, /undefinedVariable is not defined/)

        // case 7: complete message
        patchInquirer({ ok: true })
        return init(path.join(__dirname, '../mock/complete-str'), path.join(__dirname, '../build/e2e/temp'), true, true)
      })
      .then(context => {
        assert.ok(fs.existsSync(context.dest))

        // case 8: complete callback
        patchInquirer({ ok: true })
        return init(path.join(__dirname, '../mock/complete-fn'), path.join(__dirname, '../build/e2e/temp'), true, true)
      })
      .then(context => {
        assert.ok(fs.existsSync(context.dest))
        done()
      })
  })
})
