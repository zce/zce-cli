import Enquirer from 'enquirer'
import * as prompt from './prompt'

jest.mock('enquirer')

test('unit:core:helpers:prompt:ask', async () => {
  Enquirer.prompt = jest.fn().mockResolvedValue({ name: 'zce' })

  expect(typeof prompt.ask).toBe('function')

  const answers = await prompt.ask<Record<string, string>>({
    type: 'input',
    name: 'name',
    message: 'What is your name?'
  })

  expect(answers.name).toBe('zce')
})
