import { join } from 'path'
import { readdirSync } from 'fs'

import { Command } from './types'

interface CommandsDict {
  [name: string]: Command
}
interface Cache {
  [path: string]: CommandsDict
}

const cache: Cache = {}

/**
 * Load dir commands
 * @param dir dir to load
 */
const loadCommands = (dir: string): CommandsDict => {
  const commandDir = join(__dirname, dir)
  // return if cached
  if (cache[dir]) return cache[commandDir]

  // scanning commands
  cache[commandDir] = readdirSync(commandDir).reduce((commands, item) => {
    try {
      const command: Command = require(join(commandDir, item)).default
      commands[command.name] = command
      if (typeof command.alias === 'string') {
        commands[command.alias] = command
      } else if (command.alias) {
        command.alias.forEach(a => {
          commands[a] = command
        })
      }
    } catch (e) {}
    return commands
  }, {})

  return cache[commandDir]
}

/**
 * All core commands
 */
const coreCommands: CommandsDict = loadCommands('./commands')

/**
 * All commands
 */
export const commands: CommandsDict = loadCommands('../commands')

/**
 * Load command by argv
 * @param argv cli arguments
 */
export const load = (argv: string[]): Command => {
  // help command
  if (['help', '--help', '-h'].includes(argv[0])) {
    return coreCommands.help
  }

  // version command
  if (['version', '--version', '-V'].includes(argv[0])) {
    return coreCommands.version
  }

  // try to load user command
  if (commands[argv[0]]) {
    // return help command if has help option
    if (argv.includes('-h') || argv.includes('--help')) {
      return coreCommands.help
    }
    return commands[argv[0]]
  }

  // try to load user default command
  if (commands.default) {
    return commands.default
  }

  // fallback default command
  return coreCommands.default
}
