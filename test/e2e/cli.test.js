const path = require('path')
const assert = require('assert')
const { spawn } = require('child_process')
const rimraf = require('rimraf')

describe('cli', function () {
  this.timeout(0)
  rimraf.sync(path.join(__dirname, '../build'))

  describe('#list', () => {
    it('Should log list in console', done => {
      const init = spawn(process.execPath, [path.join(__dirname, '../../bin/zce-list.js'), 'fake-users'], {
        env: { NODE_ENV: 'testing' }
      })

      let output = ''

      init.stdout.on('data', data => {
        output += data
      })

      init.on('error', err => {
        assert.ok(!err)
        done()
      })

      init.on('close', () => {
        assert.equal('Not found available', output.trim())
        done()
      })
    })

    it('Should log list in console', done => {
      const init = spawn(process.execPath, [path.join(__dirname, '../../bin/zce-list.js'), 'fake-users', '--debug'], {
        env: { NODE_ENV: 'testing' }
      })

      let output = ''

      init.stdout.on('data', data => {
        output += data
      })

      init.on('error', err => {
        assert.ok(!err)
        done()
      })

      init.on('close', () => {
        assert.equal('Not found available', output.trim())
        done()
      })
    })
  })

  // // TODO: test init cli
  // describe('#init', () => {
  //   it('Should generate `template` → `build/e2e/cli`', done => {
  //     const init = spawn(process.execPath, [path.join(__dirname, '../../bin/zce-init.js'), 'init', 'zce-mock/e2e-test', 'cli-test'], {
  //       cwd: path.join(__dirname, '../build/'),
  //       env: {
  //         NODE_ENV: 'testing',
  //         TEST_API: 'https://api.github.com/users/fake-users/repos'
  //       }
  //     })

  //     let output = ''

  //     init.stdout.on('data', data => {
  //       output += data
  //     })

  //     init.on('error', err => {
  //       assert.ok(!err)
  //       done()
  //     })

  //     init.on('close', () => {
  //       assert.equal('Not found available', output.trim())
  //       done()
  //     })
  //   })
  // })
})
