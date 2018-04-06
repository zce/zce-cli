/**
 * Generator util
 */

const util = require('../util')

/**
 * Template name is local path
 * @param {String} template template name or uri
 */
exports.isLocalPath = template => {
  return /^[./]|^[a-zA-Z]:/.test(template)
}

/**
 * Get template url
 * @param {String} template template name or uri
 */
exports.getTemplateUrl = template => {
  // full url
  if (/^https?:/.test(template)) return template
  // short name
  template = template.includes('/') ? template : `zce-templates/${template}`
  // branch
  const temp = template.split('#')
  // github archive link
  return `https://github.com/${temp[0]}/archive/${temp[1] || 'master'}.zip`
}

Object.assign(exports, util)
