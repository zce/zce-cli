/**
 * generator:prompt
 */

const test = require('ava')
const prompt = require('../../../lib/generator/prompt')

/**
 * test dependencies
 */
const mockPrompt = require('../../tool/mock-prompt')
const mockStdio = require('../../tool/mock-stdio')
const util = require('../../../lib/common/util')

test.before(async t => {
  await util.rimraf(util.getDataPath('generator/config.json'))
  // turn off stdout
  t.context.stop = mockStdio.stdout()
})

test.after(t => {
  // turn on stdout
  t.context.stop()
})

test.serial('generator:prompt:default_question', async t => {
  mockPrompt({})
  const answers = await prompt({}, __dirname)
  t.is(answers.name, 'generator')
})

test.serial('generator:prompt:default_value', async t => {
  mockPrompt({})

  const questions = {
    name: { type: 'input', message: 'name' },
    foo: { type: 'input', message: 'foo', default: 'bar' }
  }
  const answers = await prompt(questions, __dirname)
  t.is(answers.name, 'generator')
  t.is(answers.foo, 'bar')
})

test.serial('generator:prompt:default_not_exists', async t => {
  mockPrompt({ notfound: 'bar' })

  const questions = {
    notfound: { type: 'input', message: 'notfound' }
  }
  const answers = await prompt(questions, __dirname)
  t.is(answers.notfound, 'bar')
})

test.serial('generator:prompt:answer_value', async t => {
  mockPrompt({ name: 'test-project', version: '0.1.0' })

  const questions = {
    name: { type: 'input', message: 'name' },
    version: { type: 'input', message: 'version' }
  }
  const answers = await prompt(questions, __dirname, true)
  t.is(answers.name, 'test-project')
  t.is(answers.version, '0.1.0')
})

test.serial('generator:prompt:validate_fail', async t => {
  mockPrompt({ name: 'FOO' })
  const questions1 = {
    name: { type: 'input', message: 'name' }
  }
  await t.throws(prompt(questions1, __dirname), 'Sorry, name can no longer contain capital letters.')

  mockPrompt({ version: 'bad' })
  const questions2 = {
    version: { type: 'input', message: 'version' }
  }
  await t.throws(prompt(questions2, __dirname), 'Sorry, The \'bad\' is not a semantic version.')
})

test.serial('generator:prompt:custom_validate', async t => {
  mockPrompt({ name: 'zce-test', version: '0.1.0' })
  const questions = {
    name: { type: 'input', message: 'name', validate: input => input.length > 3 },
    version: { type: 'input', message: 'version', validate: input => input.length > 3 }
  }
  const answers = await prompt(questions, __dirname)
  t.is(answers.name, 'zce-test')
  t.is(answers.version, '0.1.0')
})
