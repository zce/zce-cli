import { satisfies } from 'semver'
import { logger } from './helpers'
const { name, engines } = require('../../package.json')

/**
 * Sniff test to ensure our dependencies are met
 */
export const sniff = (): void => {
  // check the node version
  if (satisfies(process.version, engines.node)) return
  logger.error(
    'You are using Node.js %s, but this version of %s requires Node.js %s.',
    process.version,
    name,
    engines.node
  )
  logger.error('Please upgrade your Node.js version before this operation.')
  // node version required
  process.exit(1)
}
