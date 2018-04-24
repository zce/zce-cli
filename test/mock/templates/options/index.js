module.exports = {
  name: 'options-template',
  version: '0.1.0',
  source: 'template',
  metadata: {
    year: new Date().getYear() + 1900
  },
  prompts: {
    name: {
      type: 'input',
      message: 'Template name'
    }
  },
  filters: {
    'bin/**': answers => answers.cli
  },
  helpers: {
    trim: input => input.trim()
  },
  plugin: answers => {
    return (files, metalsmith, next) => next()
  },
  complete: context => {
    console.log('  Good luck~')
  }
}
