const fs = require('fs')
const got = require('got')

const { name, version, homepage } = require('../../package')

const defaultHeaders = {
  'user-agent': `${name}/${version} (${homepage})`
}

/**
 * Send a http request.
 * @param {string} url     url
 * @param {Object} options options
 */
exports.request = (url, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({}, defaultHeaders, options.headers)

  // timeout & content type
  options.timeout = options.timeout || 5000
  options.json = options.json || true

  return got(url, options)
}

/**
 * Download remote resource
 * @param {string} url     url
 * @param {string} dest    destination
 * @param {Object} options options
 */
exports.download = (url, dest, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({}, defaultHeaders, options.headers)

  return got.stream(url, dest, options).pipe(fs.createWriteStream(dest))
}
