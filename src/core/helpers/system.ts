import { homedir, tmpdir } from 'os'
import { join } from 'path'
import execa from 'execa'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { name } = require('../../../package.json')

const identify = process.env.NODE_ENV === 'test' ? name : `${name}-test`

/**
 * Get data path.
 * @param paths path
 */
export const getDataPath = (...paths: string[]): string => {
  return join(homedir(), '.config', identify, ...paths)
}

/**
 * Get temp path.
 * @param paths path
 */
export const getTempPath = (...paths: string[]): string => {
  return join(tmpdir(), identify, ...paths)
}

export { execa }
