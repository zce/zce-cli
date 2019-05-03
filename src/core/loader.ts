import { join } from 'path'
import { readdirSync } from 'fs'

import { Command } from './types'

/**
 * Load core command
 * @param name command name
 */
export const loadCoreCommand = (name: string): Command =>
  require(`./commands/${name}`).default

/**
 * Load user command
 * @param name command name
 */
export const loadUserCommand = (name: string): Command =>
  require(`../commands/${name}`).default

/**
 * Load all user command
 */
export const loadAllUserCommand = (): Command[] =>
  readdirSync(join(__dirname, '../commands')).map(
    file => require(`../commands/${file}`).default
  )

/**
 * Load command by argv
 * @param argv cli arguments
 */
export const load = (argv: string[]): Command => {
  // help command
  if (['help', '--help', '-h'].includes(argv[0])) {
    return loadCoreCommand('help')
  }

  // version command
  if (['version', '--version', '-V'].includes(argv[0])) {
    return loadCoreCommand('version')
  }

  try {
    // try to load user command
    const command = loadUserCommand(argv[0])
    if (argv.includes('-h') || argv.includes('--help')) {
      return loadCoreCommand('help')
    }
    return command
  } catch (e) {
    try {
      // try to load user default command
      return loadUserCommand('default')
    } catch (e) {
      // fallback default command
      return loadCoreCommand('default')
    }
  }
}
