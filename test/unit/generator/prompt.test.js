/**
 * generator:prompt
 */

const test = require('ava')
const prompt = require('../../../lib/generator/prompt')

/**
 * test dependencies
 */
const mockPrompt = require('../../tool/mock-prompt')

test.serial('generator:prompt:default', async t => {
  const questions = {
    name: { type: 'input', message: 'name' }
  }

  mockPrompt({})

  const answers = await prompt(questions, __dirname)

  t.is(answers.name, 'generator')
})

test.serial('generator:prompt:input', async t => {
  const questions = {
    name: { type: 'input', message: 'name', default: 'zce' },
    repo: { type: 'input', message: 'repo' }
  }

  mockPrompt({
    name: 'zce-cli',
    repo: 'zce-cli-repo'
  })

  const answers = await prompt(questions, __dirname)

  console.log(answers)
  t.is(answers.name, 'zce-cli')
  t.is(answers.repo, 'zce-cli-repo')
})

// TODO: remove ignore
