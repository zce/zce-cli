import Enquirer from 'enquirer'
import { prompt } from './prompt'

jest.mock('enquirer')

test('unit:core:helpers:prompt', async () => {
  Enquirer.prompt = jest.fn().mockResolvedValue({ name: 'zce' })

  expect(typeof prompt).toBe('function')

  const answers = await prompt<Record<string, string>>({
    type: 'input',
    name: 'name',
    message: 'What is your name?'
  })

  expect(answers.name).toBe('zce')
})
