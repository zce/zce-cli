const got = require('got')
const download = require('download')

const pkg = require('../../package')

const defaultHeaders = {
  'user-agent': `${pkg.name}/${pkg.version} (${pkg.homepage})`
}

/**
 * Send http request.
 * @param {String} url     url
 * @param {Object} options options
 */
exports.request = async (url, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({}, defaultHeaders, options.headers)

  // timeout & content type
  options.timeout = options.timeout || 10000
  options.json = options.json || true

  return got(url, options)
}

/**
 * Download remote resource
 * @param {String} url     url
 * @param {String} dest    destination
 * @param {Object} options options
 */
exports.download = async (url, dest, options = {}) => {
  // set default user-agent
  options.headers = Object.assign({}, defaultHeaders, options.headers)

  return download(url, dest, options)
}
