// import { createWriteStream } from 'fs'

import { extend } from 'got'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name, version, homepage } = require('../../../package.json')

/**
 * Send a http request.
 * @param url url
 * @param options options
 */
export const request = extend({
  timeout: 5000,
  json: true,
  headers: {
    'user-agent': `${name}/${version} (${homepage})`
  }
})

/**
 * Download remote resource
 * @param url url
 * @param dest destination
 * @param options options
 */
export const download = request.stream
