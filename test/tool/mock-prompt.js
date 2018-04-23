/**
 * Can not be used in parallel environments!!!
 * https://github.com/SBoudrias/Inquirer.js/issues/379#issuecomment-368479630
 */

const inquirer = require('inquirer')

/**
 * Mock inquirer prompt
 * @param {Object} fills Default return answers
 */
module.exports = fills => {
  if (typeof fills !== 'object') {
    throw new TypeError('The mocked answers must be an objects.')
  }

  const originalPrompt = inquirer.prompt

  const mockPrompt = async questions => {
    const answers = {}
    for (const item of [].concat(questions)) {
      let result = fills[item.name]

      if (!result && item.default) {
        result = typeof item.default === 'function' ? await item.default() : item.default
      }

      answers[item.name] = result
    }
    return answers
  }

  inquirer.prompt = mockPrompt

  return () => {
    inquirer.prompt = originalPrompt
  }
}
