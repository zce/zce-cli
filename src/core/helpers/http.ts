import { tmpdir } from 'os'
import { join, basename } from 'path'
import { createWriteStream } from 'fs'

import { extend, GotUrl, GotOptions } from 'got'

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
 * @param options options
 */
export const download = async (url: GotUrl, options?: GotOptions<string>) => {
  const filename = join(tmpdir(), name, basename(url as string))
  await request.stream(url, options).pipe(createWriteStream(filename))
  return filename
}
