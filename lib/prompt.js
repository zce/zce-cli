const inquirer = require('inquirer')

const defaultPrompts = {
  name: { type: 'input', message: 'name' }
}

/**
 * Prompt all questions
 * @param  {Object}   prompts  Prompts
 * @return {Function} defaults Set defaults function
 * @return {Promise}           Prompt promise
 */
module.exports = (prompts, defaults) => {
  prompts = Object.assign({}, defaultPrompts, prompts)

  const questions = Object.keys(prompts)
    .map(key => Object.assign({}, prompts[key], { name: key }))
    .map(defaults)

  return inquirer.prompt(questions)
}
