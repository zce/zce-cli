const os = require('os')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

/**
 * Check path exists sync.
 */
exports.existsSync = input => {
  try {
    fs.accessSync(input)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Check input path locally.
 */
exports.isLocalPath = input => {
  return /^[./]|^[a-zA-Z]:/.test(input)
}

/**
 * Get template url.
 */
exports.getTemplateUrl = input => {
  if (/^https?:/.test(input)) return input

  input = input.includes('/') ? input : `zce-templates/${input}`
  const arr = input.split('#')
  return `https://github.com/${arr[0]}/archive/${arr[1] || 'master'}.zip`
}

/**
 * Tildify input path.
 */
exports.tildify = input => {
  input = path.normalize(input)
  const homedir = os.homedir()
  return input.includes(homedir) ? input.replace(homedir, '~') : input
}

/**
 * Untildify input path.
 */
exports.untildify = input => {
  input = path.normalize(input)
  const homedir = os.homedir()
  return input.includes('~') ? input.replace('~', homedir) : input
}

/**
 * Encrypt the input string to MD5
 */
exports.md5 = input => {
  return crypto.createHash('md5').update(input).digest('hex')
}
