/**
 * https://github.com/SBoudrias/Inquirer.js/issues/379#issuecomment-368479630
 */

const inquirer = require('inquirer')

const isNumber = i => typeof i === 'number'
const isFunction = i => typeof i === 'function'
const isUndefined = i => typeof i === 'undefined'

/**
 * Prompt handler
 * @param  {Object} prompt
 * @param  {Object} answers
 * @param  {string} input
 */
const promptHandler = async (prompt, answers, input) => {
  if (prompt.when === false) return

  if (isFunction(prompt.when) && !await prompt.when(answers)) return

  isFunction(prompt.message) && prompt.message(answers)

  isFunction(prompt.transformer) && prompt.message(input)

  let answer = input
  if (isUndefined(answer)) {
    if (isFunction(prompt.default)) {
      answer = await prompt.default(answers)
    } else {
      answer = prompt.default
    }

    if (isNumber(answer) && prompt.type in ['list', 'rawlist', 'expand']) {
      if (isFunction(prompt.choiches)) {
        answer = await prompt.choiches(answers)[answer]
      } else {
        answer = prompt.choiches[answer]
      }
    }

    switch (prompt.type) {
      case 'expand':
        answer = {
          key: 'h',
          name: 'Help, list all options',
          value: 'help'
        }
        break
      case 'checkbox':
        answer = []
        break
      case 'confirm':
        answer = false
        break
      default:
        if (Array.isArray(prompt.choiches)) {
          [answer] = prompt.choiches
        } else if (isFunction(prompt.choiches)) {
          [answer] = await prompt.choiches(answers)
        } else {
          answer = ''
        }
    }
  }

  if (isFunction(prompt.filter)) {
    answer = await prompt.filter(answer)
  }

  if (isFunction(prompt.validate)) {
    const valid = await prompt.validate(answer, answers)
    if (valid !== true) {
      throw new Error(valid)
    }
  }
  return answer
}

/**
 * @param  {Object} inputs
 * @return {Function}
 */
const inquirerHandler = inputs => {
  /**
   * @param  {Object} prompts
   * @return {Promise.<Object>}
   */
  return async prompts => {
    const answers = {}
    for (const prompt of [].concat(prompts)) {
      answers[prompt.name] = await promptHandler(prompt, answers, inputs[prompt.name])
    }
    return answers
  }
}

/**
 * Mock prompt
 * @param {Object|Object[]} inputs
 */
module.exports = (inputs, disposable = true) => {
  if (typeof inputs !== 'object') {
    throw new TypeError('The mocked answers must be an objects.')
  }

  const promptOriginal = inquirer.prompt

  const promptMock = async questions => {
    try {
      const answers = await inquirerHandler(inputs)(questions)
      if (disposable) {
        inquirer.prompt = promptOriginal
      }
      return Promise.resolve(answers)
    } catch (err) {
      if (disposable) {
        inquirer.prompt = promptOriginal
      }
      return Promise.reject(err)
    }
  }

  promptMock.prompts = inquirer.prompt.prompts
  promptMock.registerPrompt = inquirer.prompt.registerPrompt
  promptMock.restoreDefaultPrompts = inquirer.prompt.restoreDefaultPrompts
  inquirer.prompt = promptMock
}

// module.exports = inputs => {
//   inquirer.prompt = questions => {
//     const result = {}
//     const patchItem = question => {
//       const key = question.name
//       if (question.validate) {
//         question.validate(inputs[key])
//         // const valid = question.validate(inputs[key])
//         // if (!valid) throw new Error(valid)
//       }
//       result[key] = inputs[key] || question.default
//     }
//     Array.isArray(questions) ? questions.forEach(patchItem) : patchItem(questions)
//     return Promise.resolve(result)
//   }
// }
