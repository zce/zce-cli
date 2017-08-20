const fs = require('fs')
const path = require('path')
const assert = require('assert')
const rimraf = require('rimraf')
const generate = require('../../lib/generate')

describe('lib/generate', () => {
  rimraf.sync(path.join(__dirname, '../build'))

  describe('#minima', () => {
    it('Should generate `minima` → `build/minima`', () => {
      const src = path.join(__dirname, '../mock/minima')
      const dest = path.join(__dirname, '../build/unit/minima')
      const answers = { name: 'minima' }

      return generate(src, dest, answers)
        .then(files => {
          assert.ok(files['zce.txt'])
          const content = fs.readFileSync(path.join(dest, 'zce.txt'), 'utf8')
          assert.equal('hey minima', content.trim())
        })
    })
  })

  describe('#source-option', () => {
    it('Should generate `source` → `build/source`', () => {
      const src = path.join(__dirname, '../mock/source')
      const dest = path.join(__dirname, '../build/unit/source')
      const answers = { name: 'source' }
      const options = require(src)

      return generate(src, dest, answers, options).then(files => {
        assert.ok(files['zce.txt'])
        const content = fs.readFileSync(path.join(dest, 'zce.txt'), 'utf8')
        assert.equal('hey source', content.trim())
      })
    })
  })

  describe('#filters-option', () => {
    it('Should generate `filters` → `build/filters`', () => {
      const src = path.join(__dirname, '../mock/filters')
      const dest = path.join(__dirname, '../build/unit/filters')
      const answers = { sass: false }
      const options = require(src)

      return generate(src, dest, answers, options).then(files => {
        assert.equal(2, Object.keys(files).length)
        assert.ok(fs.existsSync(path.join(dest, 'assets/style.css')))
        assert.ok(!fs.existsSync(path.join(dest, 'assets/style.scss')))
      })
    })
  })

  describe('#helpers-option', () => {
    it('Should generate `helpers` → `build/helpers`', () => {
      const src = path.join(__dirname, '../mock/helpers')
      const dest = path.join(__dirname, '../build/unit/helpers')
      const answers = { name: 'helpers' }
      const options = require(src)

      return generate(src, dest, answers, options).then(files => {
        assert.equal(2, Object.keys(files).length)
        const builtInContent = fs.readFileSync(path.join(dest, 'built-in.txt'), 'utf8')
        assert.equal('hello helpers', builtInContent.trim())
        const customContent = fs.readFileSync(path.join(dest, 'custom.txt'), 'utf8')
        assert.equal('HELPERS', customContent.trim())
      })
    })
  })

  describe('#error-handle', () => {
    it('Should catch a error when generate `error`', () => {
      const src = path.join(__dirname, '../mock/error')
      const dest = path.join(__dirname, '../build/unit/error')
      const answers = {}

      return generate(src, dest, answers)
        .then(files => assert.ok(false))
        .catch(err => assert.throws(() => { throw err }, Error))
    })
  })

  describe('#plugin-option', () => {
    it('Should generate `plugin` → `build/plugin`', () => {
      const src = path.join(__dirname, '../mock/plugin')
      const dest = path.join(__dirname, '../build/unit/plugin')
      const answers = { name: 'plugin' }
      const options = require(src)

      return generate(src, dest, answers, options).then(files => {
        assert.ok(files['zce.txt'])
        const content = fs.readFileSync(path.join(dest, 'zce.txt'), 'utf8')
        assert.equal('zce plugin hey plugin intercept', content.trim())
      })
    })
  })
})
