const path = require('path')
const assert = require('assert')
const { spawn } = require('child_process')
const logger = require('../../lib/logger')

describe('lib/logger', function () {
  describe('#log', () => {
    it('Coverage logger.log()', () => {
      logger.log('foo')

      const env = process.env.NODE_ENV
      delete process.env.NODE_ENV
      logger.log('foo')
      process.env.NODE_ENV = env
    })

    it('Should log `foo bar baz` to console when non test environmen', done => {
      const code = 'const logger = require("./logger"); logger.log("foo", "bar", "baz")'

      let output = ''

      const runner = spawn(process.execPath, ['-e', code], {
        cwd: path.join(__dirname, '../../lib'),
        env: { NODE_ENV: '' }
      })

      runner.stdout.on('data', data => {
        output += data
      })

      runner.on('close', () => {
        assert.equal('foo bar baz', output.trim())
        done()
      })

      runner.on('error', err => {
        assert.ok(!err)
        done()
      })
    })

    it('Should console become silent when testing environmen', done => {
      const code = 'const logger = require("./logger"); logger.log("foo", "bar", "baz")'

      let output = ''

      const runner = spawn(process.execPath, ['-e', code], {
        cwd: path.join(__dirname, '../../lib'),
        env: { NODE_ENV: 'testing' }
      })

      runner.stdout.on('data', data => {
        output += data
      })

      runner.on('close', () => {
        assert.equal('', output.trim())
        done()
      })

      runner.on('error', err => {
        assert.ok(!err)
        done()
      })
    })
  })

  describe('#fatal', () => {
    it('Coverage logger.fatal()', () => {
      assert.throws(() => logger.fatal('foo message', new Error('foo error')), /foo error/)

      const env = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'
      logger.fatal('foo message', new Error('foo error'))
      process.env.NODE_ENV = env
    })

    it('Should log warn to console when non test environmen', done => {
      const code = 'const logger = require("./logger"); logger.fatal("foo message", new Error("foo error"))'

      let output = ''

      const runner = spawn(process.execPath, ['-e', code], {
        cwd: path.join(__dirname, '../../lib'),
        env: { NODE_ENV: '' }
      })

      runner.stderr.on('data', data => {
        output += data
      })

      runner.on('close', () => {
        assert.equal('foo message', output.trim())
        done()
      })

      runner.on('error', err => {
        assert.ok(!err)
        done()
      })
    })

    it('Should console become silent when testing environmen', done => {
      const code = 'const logger = require("./logger"); logger.fatal("foo message", new Error("foo error"))'

      let output = ''

      const runner = spawn(process.execPath, ['-e', code], {
        cwd: path.join(__dirname, '../../lib'),
        env: { NODE_ENV: 'testing' }
      })

      runner.stdout.on('data', data => {
        output += data
      })

      runner.on('close', () => {
        assert.equal('', output.trim())
        done()
      })

      runner.on('error', err => {
        assert.ok(!err)
        done()
      })
    })
  })
})
