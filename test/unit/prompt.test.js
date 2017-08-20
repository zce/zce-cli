const assert = require('assert')
const prompt = require('../../lib/prompt')
const patchInquirer = require('../common/patch-inquirer')

describe('lib/prompt', () => {
  describe('#normal', () => {
    it('Should return right answers', () => {
      const prompts = {
        name: { type: 'input', message: 'Project name' },
        author: { type: 'input', message: 'Project author' },
        version: { type: 'input', message: 'Project version' },
        license: { type: 'input', message: 'Project license' },
        repo: { type: 'input', message: 'Project repository' },
        repository: { type: 'input', message: 'Project repository' }
      }

      patchInquirer({
        name: 'foo',
        author: 'zce',
        version: '1.0.0',
        license: 'ISC',
        repo: 'https://github.com/zce/zce-cli.git',
        repository: 'https://github.com/zce/zce-cli.git'
      })

      return prompt(prompts, item => item).then(answers => {
        assert.equal('foo', answers.name)
        assert.equal('zce', answers.author)
        assert.equal('1.0.0', answers.version)
        assert.equal('ISC', answers.license)
        assert.equal('https://github.com/zce/zce-cli.git', answers.repo)
        assert.equal('https://github.com/zce/zce-cli.git', answers.repository)
      })
    })
  })
})
