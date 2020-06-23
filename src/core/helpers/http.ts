import { pipeline } from 'stream'
import { tmpdir } from 'os'
import { promisify } from 'util'
import { join, basename } from 'path'
import { createWriteStream } from 'fs'
import got, { StreamOptions } from 'got'
import { name, version, homepage } from '../../../package.json'

const pipe = promisify(pipeline)

/**
 * Send a http request.
 * @param url url
 * @param options options
 */
export const request = got.extend({
  timeout: 5000,
  responseType: 'json',
  headers: {
    'user-agent': `${name}/${version} (${homepage})`
  }
})

/**
 * Download remote resource
 * @param url url
 * @param options options
 */
export const download = async (url: string | URL, options?: StreamOptions): Promise<string> => {
  const filename = join(tmpdir(), name, basename(url as string))

  await pipe(request.stream(url, options), createWriteStream(filename))

  return filename
}
