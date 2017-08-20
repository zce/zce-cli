const { execSync } = require('child_process')
const rc = require('rc')
const validateName = require('validate-npm-package-name')
const semver = require('semver')

const setNameValidate = item => {
  const customValidate = item.validate
  item.validate = input => {
    const result = validateName(input)
    if (!result.validForNewPackages) {
      return `Sorry, ${(result.errors || []).concat(result.warnings || []).join(' and ')}.`
    }
    return typeof customValidate !== 'function' ? true : customValidate(input)
  }
}

const setVersionValidate = item => {
  const customValidate = item.validate
  item.validate = input => {
    const result = semver.valid(input)
    if (!result) {
      return `Sorry, The '${input}' is not a semantic version.`
    }
    return typeof customValidate !== 'function' ? true : customValidate(input)
  }
}

const getAuthor = npmrc => {
  const email = npmrc['init-author-email']
  const url = npmrc['init-author-url']

  return `${npmrc['init-author-name']}${email ? ` <${email}>` : ''}${url ? ` (${url})` : ''}`
}

const getRepository = dir => {
  try {
    return execSync(`cd ${dir} && git config --local --get remote.origin.url`).toString().trim()
  } catch (e) {}
}

/**
 * Get set defaults function
 * @param  {String}  dest    Destination path
 * @param  {Boolean} exists  Destination path exists
 * @param  {String}  name    Default name
 * @return {Function}        Set defaults function
 */
module.exports = (dest, exists, name) => item => {
  const npmrc = rc('npm', {
    'init-author-name': '',
    'init-author-email': '',
    'init-author-url': '',
    'init-version': '0.1.0',
    'init-license': 'MIT'
  })

  switch (item.name) {
    case 'name':
      item.default = item.default || name
      // TODO: Make sure need valdate?
      setNameValidate(item)
      break
    case 'author':
      item.default = item.default || getAuthor(npmrc)
      break
    case 'version':
      item.default = item.default || npmrc['init-version']
      setVersionValidate(item)
      break
    case 'license':
      item.default = item.default || npmrc['init-license']
      break
    case 'repo':
    case 'repository':
      if (exists) item.default = item.default || getRepository(dest)
      break
  }
  return item
}
