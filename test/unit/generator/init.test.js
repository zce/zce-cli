/**
 * generator:init
 */

const test = require('ava')
const init = require('../../../lib/generator/init')

/**
 * test dependencies
 */
const fs = require('fs')
const os = require('os')
const path = require('path')
const { promisify } = require('util')
const util = require('../../../lib/common/util')
const mockStdio = require('../../tool/mock-stdio')
const mockPrompt = require('../../tool/mock-prompt')

const readFile = promisify(fs.readFile)

test.before(async t => {
  // turn off stdout
  t.context.stop = mockStdio.stdout()

  const tmpdir = path.join(os.tmpdir(), 'zce-test/init')
  await util.mkdirp(tmpdir)

  // realpathSync https://github.com/nodejs/node/issues/7545
  t.context.tmpdir = fs.realpathSync(tmpdir)

  t.context.originalCwd = process.cwd()
  process.chdir(t.context.tmpdir)
})

// cleanup
test.after(async t => {
  process.chdir(t.context.originalCwd)
  await util.rimraf(t.context.tmpdir)

  // turn on stdout
  t.context.stop()
})

test.serial('generator:init:local', async t => {
  const template = path.join(__dirname, '../../mock/templates/minima')

  mockPrompt({ name: 'project-minima', sure: true })

  await init(template)

  t.true(await util.exists(path.join(t.context.tmpdir, 'zce.txt')))

  const content = await readFile(path.join(t.context.tmpdir, 'zce.txt'), 'utf8')
  t.is(content.trim(), 'hey project-minima')

  // // git init test
  // t.true(await util.exists(path.join(t.context.tmpdir, '.git')))
})

test.serial('generator:init:remote', async t => {
  const template = 'minima'
  const project = 'project-minima'

  mockPrompt({})

  await init(template, project, { force: true })

  t.true(await util.exists(path.join(t.context.tmpdir, 'project-minima/zce.txt')))

  const content = await readFile(path.join(t.context.tmpdir, 'project-minima/zce.txt'), 'utf8')
  t.is(content.trim(), 'hey project-minima')
})
