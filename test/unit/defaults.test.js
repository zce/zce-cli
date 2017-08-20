const os = require('os')
const fs = require('fs')
const path = require('path')
const assert = require('assert')
const defaults = require('../../lib/defaults')

let npmrc = ''

describe('lib/defaults', () => {
  before(() => {
    npmrc = fs.readFileSync(path.join(os.homedir(), '.npmrc'), 'utf8')
    fs.writeFileSync(path.join(os.homedir(), '.npmrc'), `init-author-name=zce
init-author-email=cli@zce.me
init-author-url=http://cli.zce.me/
init-version=1.0.0
init-license=MIT
`)
  })

  describe('#name', () => {
    it('Should return `foo`', () => {
      const result = defaults(__dirname, false, 'foo')({ name: 'name' })
      assert.equal('foo', result.default)
    })

    it('Should return npm name validate function', () => {
      let result = defaults(__dirname, false, 'foo')({ name: 'name' })
      assert.equal('boolean', typeof result.validate('foo'))
      assert.equal('string', typeof result.validate('FOO'))
      assert.equal('string', typeof result.validate(' foo '))
      result = defaults(__dirname, false, 'foo')({ name: 'name', validate: input => 'error' })
      assert.equal('string', typeof result.validate('foo'))
    })
  })

  describe('#version', () => {
    it('Should return `1.0.0`', () => {
      const result = defaults()({ name: 'version' })
      assert.equal('1.0.0', result.default)
    })

    it('Should return version validate function', () => {
      let result = defaults()({ name: 'version' })
      assert.equal('boolean', typeof result.validate('0.1.0'))
      assert.equal('string', typeof result.validate('a.b.c'))
      result = defaults()({ name: 'version', validate: input => 'error' })
      assert.equal('string', typeof result.validate('0.1.0'))
    })
  })

  describe('#author', () => {
    it('Should return `zce <cli@zce.me> (http://cli.zce.me/)`', () => {
      const result = defaults()({ name: 'author' })
      assert.equal('zce <cli@zce.me> (http://cli.zce.me/)', result.default)
    })

    it('Should return `zce`', function () {
      fs.writeFileSync(path.join(os.homedir(), '.npmrc'), `init-author-name=zce
init-version=1.0.0
init-license=MIT
`)
      const result = defaults()({ name: 'author' })
      assert.equal('zce', result.default)
    })
  })

  describe('#license', () => {
    it('Should return `zce`', () => {
      const result = defaults()({ name: 'license' })
      assert.equal('MIT', result.default)
    })
  })

  describe('#repository', () => {
    it('Should return `https://github.com/zce/zce-cli.git`', () => {
      const result = defaults(__dirname, true)({ name: 'repository' })
      assert.equal('https://github.com/zce/zce-cli.git', result.default)
    })

    it('Should return `https://github.com/zce/zce-cli.git`', () => {
      const result = defaults(__dirname, true)({ name: 'repo' })
      assert.equal('https://github.com/zce/zce-cli.git', result.default)
    })

    it('Should return `https://github.com/zce/zce-cli.git`', () => {
      const result = defaults(__dirname, false)({ name: 'repo' })
      assert.equal(undefined, result.default)
    })
  })

  after(() => {
    fs.writeFileSync(path.join(os.homedir(), '.npmrc'), npmrc)
  })
})
