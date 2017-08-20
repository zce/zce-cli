const inquirer = require('inquirer')

module.exports = fake => {
  inquirer.prompt = questions => {
    const result = {}
    const patchItem = question => {
      const key = question.name
      if (question.validate) {
        question.validate(fake[key])
        // const valid = question.validate(fake[key])
        // if (!valid) throw new Error(valid)
      }
      result[key] = fake[key] || question.default
    }
    Array.isArray(questions) ? questions.forEach(patchItem) : patchItem(questions)
    return Promise.resolve(result)
  }
}
